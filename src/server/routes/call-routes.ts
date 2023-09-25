import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { qstash } from "@/lib/upstash";
import {
  APP_URL_WITH_NGROK,
  DEFAULT_RING_DURATION,
  IS_ON_VERCEL,
} from "@/lib/constants";
import { DateTime } from "luxon";
import { meetingBody, zoomAuth } from "@/lib/integrations/zoom";

const zoomMeetingResponse = z.object({
  start_url: z.string().url(),
  join_url: z.string().url(),
});

const DEFAULT_GEO_DATA = {
  country: "US",
};

export const callRoutes = createTRPCRouter({
  requestCall: publicProcedure
    .input(
      z.object({
        caller: z.object({
          name: z.string().min(1),
          email: z.string().email().min(1),
          country: z.string().max(2).optional(),
          reason: z.string().min(1),
        }),
        target: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx: { prisma, twilio, req }, input }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { country } = IS_ON_VERCEL && req.geo ? req.geo : DEFAULT_GEO_DATA;

      const call = await prisma.call.create({
        data: {
          target: {
            connect: {
              id: input.target,
            },
          },
          callerEmail: input.caller.email,
          callerName: input.caller.name,
          callerReason: input.caller.reason,
          countryCode: country,
          hostedOn: "ZOOM", //! Default to Zoom as it's the only thing we support for now
          status: "PENDING",
        },
      });

      try {
        // skip await to return faster
        void qstash.publishJSON({
          delay: DEFAULT_RING_DURATION,
          method: "POST",
          body: {
            callId: call.id,
          },
          url: `${APP_URL_WITH_NGROK}/api/qstash/update-call-status`,
        });

        const target = await prisma.user.findUnique({
          where: {
            id: input.target,
          },
          include: {
            notifications: {
              take: 1,
            }
          }
        });

        const targetNotification = target?.notifications[0];

        // skip await to return faster
        if (targetNotification?.key && !target?.dnd) {
          const isWhatsapp = targetNotification.type === "WHATSAPP";
          void twilio.messages.create({
            from: `${isWhatsapp ? "whatsapp:" : ""}${env.TWILIO_PHONE_NUMBER}`,
            to: `${isWhatsapp ? "whatsapp:" : ""}${targetNotification.key}`,

            body: `You have a new Jumpcal meeting request from ${input.caller.name} who wants to talk about "${input.caller.reason}".`,
          });
        }
      } catch (error) {
        console.error(error);
      }

      return call;
    }),
  incomingCalls: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      const past = DateTime.now().minus({ seconds: DEFAULT_RING_DURATION });

      return prisma.call.findMany({
        where: {
          status: "PENDING",
          target: {
            id: session.user.id,
          },
          createdAt: {
            gt: past.toJSDate(),
          },
        },
      });
    },
  ),
  callStatus: publicProcedure
    .input(
      z.object({
        callId: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const call = await prisma.call.findUniqueOrThrow({
        where: {
          id: input.callId,
        },
        select: {
          createdAt: true,
          status: true,
          link: true,
          hostedOn: true,
        },
      });

      const date = new Date();

      const differenceInMilliseconds =
        date.getTime() - call.createdAt.getTime();
      const differenceInSeconds = differenceInMilliseconds / 1000;

      return {
        status: differenceInSeconds > DEFAULT_RING_DURATION ? "MISSED" : call.status,
        ringingFor: differenceInSeconds,
        host: { type: call.hostedOn, link: call.link },
      };
    }),
  reject: protectedProcedure
    .input(z.object({ callId: z.string() }))
    .mutation(({ ctx: { prisma }, input }) => {
      return prisma.call.update({
        where: {
          id: input.callId,
        },
        data: {
          status: "REJECTED",
        },
      });
    }),
  accept: protectedProcedure
    .input(z.object({ callId: z.string() }))
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      const call = await prisma.call.findUniqueOrThrow({
        where: {
          id: input.callId,
        },
      });

      const integration = await prisma.integration.findUnique({
        where: {
          userId_type: {
            userId: session.user.id,
            type: "ZOOM",
          },
        },
      });

      if (!integration) {
        throw new Error("Invalid integration.");
      }

      const zoom = zoomAuth(integration);
      const token = await zoom.getToken();

      const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(meetingBody(call, session.user.name)),
      });

      const zoomResponse = await response.json();
      const zoomMeeting = zoomMeetingResponse.parse(zoomResponse);

      const updated = await prisma.call.update({
        where: {
          id: call.id,
        },
        data: {
          link: zoomMeeting.join_url,
          status: "ANSWERED",
          acceptedAt: new Date()
        },
      });

      // try {
      //   // we don't care about the promise here
      //   void qstash.publishJSON({
      //     delay: 30 * 60, // 30 minutes
      //     method: "POST",
      //     body: {
      //       callId: call.id,
      //     },
      //     url: `${APP_URL_WITH_NGROK}/api/qstash/send-email-call-recipient`,
      //   });
      // } catch (err) {
      //   console.error("QStash reminder failed to publish", err);
      // }

      return { startUrl: zoomMeeting.start_url, call: updated };
    }),
  callLog: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx: { session, prisma }, input }) => {
      return prisma.call.findMany({
        take: 20,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          status: {
            not: "PENDING",
          },
          target: {
            id: session.user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
