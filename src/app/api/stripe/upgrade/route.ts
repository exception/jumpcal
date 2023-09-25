import { env } from "@/env.mjs";
import { APP_URL } from "@/lib/constants";
import { checkPremiumUsername } from "@/lib/premium";
import stripe, { getStripeCustomerId } from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const queryParams = z.object({
  username: z.string().optional(),
});

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { username } = queryParams.parse(
      Object.fromEntries(url.searchParams),
    );

    const customerId = await getStripeCustomerId(session.user);
    if (!customerId) {
      return Response.redirect(
        `${APP_URL}/settings/billing?error=Stripe ID not available`,
      );
    }

    if (username) {
      // this is an upgrade via username change -> premium
      const { available } = await checkPremiumUsername(username);
      if (!available) {
        return Response.redirect(
          `${APP_URL}/settings/billing?error=Username no longer available`,
        );
      }
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      return Response.redirect(
        `${APP_URL}/settings/billing?error=Stripe customer no longer available`,
      );
    }

    await stripe.customers.update(customerId, {
      metadata: {
        ...customer.metadata,
        username: username ?? customer.metadata.username ?? "",
      },
    });

    const returnUrl = `${APP_URL}/api/stripe/callback?checkoutId={CHECKOUT_SESSION_ID}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer: customer.id,
      line_items: [
        {
          quantity: 1,
          price: env.STRIPE_PREMIUM_PRICE_ID,
        },
      ],
    });

    if (!checkoutSession || !checkoutSession.url) {
      return Response.redirect(
        `${APP_URL}/settings/billing?error=Stripe checkout failed to create`,
      );
    }

    return Response.redirect(checkoutSession.url);
  } catch (err) {
    console.error("Failed stripe checkout", err);
    return Response.redirect(
      `${APP_URL}/settings/billing?error=Stripe checkout failed`,
    );
  }
};
