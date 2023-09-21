import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "@/env.mjs";

const NotificationType = z.enum(["SMS", "WHATSAPP", "SLACK"]);

export const notificationRoutes = createTRPCRouter({
  sendVerifyCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        channel: NotificationType.exclude(["SLACK"]),
      }),
    )
    .mutation(async ({ ctx: { twilio }, input }) => {
      await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verifications.create({ to: input.phone, channel: input.channel.toLowerCase() });
      return true;
    }),
  verifyTwilioCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        code: z.string().min(1).max(6),
        channel: NotificationType.exclude(["SLACK"]),
      }),
    )
    .mutation(async ({ ctx: { session, prisma, twilio }, input }) => {
      const { status } = await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verificationChecks.create({ to: input.phone, code: input.code });
      if (status === "approved") {
        await prisma.notification.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            key: input.phone,
            type: input.channel,
          },
        });

        return { status: "verified" };
      }

      return { status: "not-verified" };
    }),
remove: protectedProcedure
    .input(
      z.object({
        type: NotificationType,
      }),
    )
    .mutation(({ ctx: { session, prisma }, input }) => {
      return prisma.notification.delete({
        where: {
          userId_type: {
            userId: session.user.id,
            type: input.type,
          },
        },
      });
    }),
  has: protectedProcedure
    .input(
      z.object({
        type: NotificationType,
      }),
    )
    .query(async ({ ctx: { session, prisma }, input }) => {
      const notification = await prisma.notification.findUnique({
        where: {
          userId_type: {
            type: input.type,
            userId: session.user.id,
          },
        },
      });

      return !!notification;
    }),
});
