import { prisma } from "@/db";
import { APP_URL } from "@/lib/constants";
import {
  getCustomerAndCheckoutSession,
} from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const queryParams = z.object({
  checkoutId: z.string(),
});

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { checkoutId } = queryParams.parse(
      Object.fromEntries(url.searchParams),
    );

    const { stripeCustomer, checkoutSession } =
      await getCustomerAndCheckoutSession(checkoutId);

    if (!stripeCustomer) {
      return Response.redirect(
        `${APP_URL}/settings/billing?error=Stripe customer deleted or not found`,
      );
    }

    let user = await prisma.user.findFirst({
      where: {
        stripeCustomerId: stripeCustomer.id,
      },
    });

    if (!user && stripeCustomer.email) {
      user = await prisma.user.findFirst({
        where: {
          email: stripeCustomer.email,
        },
      });
    }

    if (checkoutSession.payment_status === "paid") {
      if (!user) {
        return Response.redirect(`${APP_URL}/settings/billing?error=User not found`);
      }

      const username = stripeCustomer.metadata?.username ?? undefined; // undefined = skip

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isPremium: true,
          username,
        },
      });
    }
    return Response.redirect(
      `${APP_URL}/settings/billing?payment_status=${checkoutSession.payment_status}`,
    );
  } catch (err) {
    console.error("Failed stripe checkout", err);
    return Response.redirect(
      `${APP_URL}/settings/billing?error=Stripe checkout failed`,
    );
  }
};
