import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "@/env.mjs";

export const notificationRoutes = createTRPCRouter({
  sendVerifyCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        channel: z.literal("whatsapp").or(z.literal("sms")),
      }),
    )
    .mutation(async ({ ctx: { twilio }, input }) => {
      await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verifications.create({ to: input.phone, channel: input.channel });
      return true;
    }),
  verifyTwilioCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        code: z.string().min(1).max(6),
        channel: z.literal("whatsapp").or(z.literal("sms")),
      }),
    )
    .mutation(async ({ ctx: { session, prisma, twilio }, input }) => {
      const { status } = await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verificationChecks.create({ to: input.phone, code: input.code });
      if (status === "approved") {
        await prisma.phoneNotification.create({
          data: {
            user: {
              connect: {
                id: session.user.id,
              },
            },
            phoneNumber: input.phone,
            type: input.channel === "whatsapp" ? "WHATSAPP" : "SMS",
          },
        });

        return { status: "verified" };
      }

      return { status: "not-verified" };
    }),
  remove: protectedProcedure
    .input(
      z.object({
        type: z.literal("whatsapp").or(z.literal("sms")),
      }),
    )
    .mutation(({ ctx: { session, prisma }, input }) => {
      return prisma.phoneNotification.delete({
        where: {
          userId_type: {
            userId: session.user.id,
            type: input.type === "whatsapp" ? "WHATSAPP" : "SMS",
          },
        },
      });
    }),
  has: protectedProcedure
    .input(
      z.object({
        type: z.literal("whatsapp").or(z.literal("sms")),
      }),
    )
    .query(async ({ ctx: { session, prisma }, input }) => {
      const phone = await prisma.phoneNotification.findUnique({
        where: {
          userId_type: {
            type: input.type === "whatsapp" ? "WHATSAPP" : "SMS",
            userId: session.user.id,
          },
        },
      });

      return !!phone;
    }),
});
