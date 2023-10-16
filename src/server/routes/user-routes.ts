import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import cloudinary from "cloudinary";
import {
  type DayAvailability,
  DayAvailabilty,
  isUserAvailable,
} from "@/lib/availability";
import { isUserBusy } from "@/lib/integrations/google-calendar";
import { checkPremiumUsername } from "@/lib/premium";

const defaultSlotRange = {
  start: { hour: 9, minute: 0 },
  end: { hour: 17, minute: 0 },
};

export const userRoutes = createTRPCRouter({
  onboard: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        username: z.string(),
        timezone: z.string(),
      }),
    )
    .mutation(({ ctx: { session, prisma }, input }) => {
      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: input.fullName,
          username: input.username.toLowerCase(),
          timezone: input.timezone,
          availability: [
            { day: "MONDAY", available: true, slots: [defaultSlotRange] },
            { day: "TUESDAY", available: true, slots: [defaultSlotRange] },
            { day: "WEDNESDAY", available: true, slots: [defaultSlotRange] },
            { day: "THURSDAY", available: true, slots: [defaultSlotRange] },
            { day: "FRIDAY", available: true, slots: [defaultSlotRange] },
            { day: "SATURDAY", available: false, slots: [defaultSlotRange] },
            { day: "SUNDAY", available: false, slots: [defaultSlotRange] },
          ],
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        fullName: z.string().optional(),
        username: z.string().optional(),
        timezone: z.string().optional(),
        description: z.string().optional(),
        layout: z.enum(["VERTICAL", "HORIZONTAL"]).optional(),
        calendarLink: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      if (input.username) {
        const username = await checkPremiumUsername(input.username);
        if (!username.available) {
          throw new Error("Username is no longer available.");
        }

        if (username.premium && !session.user.isPremium) {
          throw new Error("Username requires a premium account");
        }

        return prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            username: input.username,
          },
        });
      }

      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: input.fullName,
          timezone: input.timezone,
          description: input.description,
          username: input.username,
          layout: input.layout,
          calendarLink: input.calendarLink,
        },
      });
    }),
  toggleDnd: protectedProcedure
    .input(
      z.object({
        state: z.boolean(),
      }),
    )
    .mutation(({ ctx: { session, prisma }, input }) => {
      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          dnd: input.state,
        },
      });
    }),
  hasIntegration: protectedProcedure
    .input(
      z.object({
        type: z.enum(["ZOOM", "CALENDAR_GCAL"]),
      }),
    )
    .query(async ({ ctx: { session, prisma }, input }) => {
      const integration = await prisma.integration.findFirst({
        where: {
          type: input.type,
          user: {
            id: session.user.id,
          },
        },
      });

      return !!integration;
    }),
  removeIntegration: protectedProcedure
    .input(
      z.object({
        type: z.enum(["ZOOM", "CALENDAR_GCAL"]),
      }),
    )
    .mutation(({ ctx: { session, prisma }, input }) => {
      return prisma.integration.delete({
        where: {
          userId_type: {
            type: input.type,
            userId: session.user.id,
          },
        },
      });
    }),
  hasIntegrations: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      const integrations = await prisma.integration.findMany({
        where: {
          userId: session.user.id,
        },
      });

      return integrations.length > 0;
    },
  ),
  updateAvatar: protectedProcedure
    .input(
      z.object({
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      const image = input.image;
      if (!image) {
        return prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            image: null,
          },
        });
      }

      const { secure_url } = await cloudinary.v2.uploader.upload(image, {
        folder: "user_pictures",
        public_id: session.user.id,
        overwrite: true,
        invalidate: true,
      });

      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: secure_url,
        },
      });
    }),
  isUserAvailable: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx: { prisma }, input }) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
        include: {
          integrations: true,
        },
      });

      const hasCallingIntegration = user.integrations.find(
        (integration) => integration.type === "ZOOM",
      );

      if (!hasCallingIntegration) {
        return { status: "offline" };
      }

      const gcal = user.integrations.find(
        (integration) => integration.type === "CALENDAR_GCAL",
      );
      if (!gcal) {
        if (
          !isUserAvailable(
            user.availability as DayAvailability[],
            user.timezone ?? "",
          )
        ) {
          return { status: "offline" };
        }

        return { status: "online" };
      }

      const isBusy = await isUserBusy(gcal);
      if (isBusy) {
        return { status: "busy" };
      }

      if (
        !isUserAvailable(
          user.availability as DayAvailability[],
          user.timezone ?? "",
        )
      ) {
        return { status: "offline" };
      }

      return { status: "online" };
    }),
  availability: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          availability: true,
        },
      });

      return user?.availability as DayAvailability[];
    },
  ),
  updateAvailability: protectedProcedure
    .input(
      z.object({
        availability: DayAvailabilty.array(),
      }),
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      return prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          availability: input.availability,
        },
      });
    }),
  usernameAvailability: publicProcedure
    .input(
      z.object({
        username: z.string().min(1).toLowerCase(),
      }),
    )
    .mutation(({ input }) => {
      return checkPremiumUsername(input.username);
    }),
  usage: protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        monthlyUsage: true,
        maxUsage: true,
      },
    });

    return { usage: user?.monthlyUsage ?? 0, max: user?.maxUsage ?? 50 };
  }),
});
