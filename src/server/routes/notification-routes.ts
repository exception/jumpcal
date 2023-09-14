import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "@/env.mjs";

export const notificationRoutes = createTRPCRouter({
  sendVerifyCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx: { twilio }, input }) => {
      await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verifications.create({ to: input.phone, channel: "sms" });
      return true;
    }),
  verifyTwilioCode: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        code: z.string().min(1).max(6),
      }),
    )
    .mutation(async ({ ctx: { session, prisma, twilio }, input }) => {
      const { status } = await twilio.verify.v2
        .services(env.TWILIO_SERVICE)
        .verificationChecks.create({ to: input.phone, code: input.code });
      if (status === "approved") {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            phoneNumber: input.phone,
          },
        });

        return { status: "verified" };
      }

      return { status: "not-verified" };
    }),
  removeSms: protectedProcedure.mutation(({ ctx: { session, prisma } }) => {
    return prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        phoneNumber: null,
      },
    });
  }),
});
