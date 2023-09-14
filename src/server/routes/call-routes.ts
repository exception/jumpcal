import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "@/env.mjs";
import { qstash } from "@/lib/upstash";
import { API_DOMAIN } from "@/lib/constants";

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
    .mutation(async ({ ctx: { prisma, twilio }, input }) => {
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
          countryCode: input.caller.country,
          hostedOn: "ZOOM", //! Default to Zoom as it's the only thing we support for now
          status: "PENDING",
        },
      });

      await qstash.schedules.create({
        delay: 60, //? let call ring for 60 seconds
        method: "POST",
        body: JSON.stringify({ callId: call.id }),
        headers: {
          "Content-Type": "application/json",
        },
        destination: `${API_DOMAIN}/api/qstash/update-call-status`,
        cron: "",
      });

      const target = await prisma.user.findUnique({
        where: {
          id: input.target,
        },
        select: {
          phoneNumber: true,
        },
      });

      if (target?.phoneNumber) {
        await twilio.messages.create({
          from: env.TWILIO_PHONE_NUMBER,
          to: target.phoneNumber,
          body: `You have a new Jumpcal meeting request from ${input.caller.name} who wants to talk about "${input.caller.reason}"`,
        });
      }

      return true;
    }),
  incomingCalls: protectedProcedure.query(({ ctx: { session, prisma } }) => {
    return prisma.call.findMany({
      where: {
        status: "PENDING",
        target: {
          id: session.user.id,
        },
      },
    });
  }),
  callStatus: publicProcedure
    .input(
      z.object({
        callId: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const call = await prisma.call.findUnique({
        where: {
          id: input.callId,
        },
      });

      if (!call) {
        return null;
      }

      const date = new Date();

      const differenceInMilliseconds =
        date.getTime() - call.createdAt.getTime();
      const differenceInSeconds = differenceInMilliseconds / 1000;

      return { status: call.status, ringingFor: differenceInSeconds };
    }),
});
