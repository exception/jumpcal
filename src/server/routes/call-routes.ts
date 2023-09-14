import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
    .mutation(async ({ ctx: { prisma }, input }) => {
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
          hostedOn: "ZOOM",
          status: "PENDING",
        },
      });

      // TODO send notification to user
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
});
