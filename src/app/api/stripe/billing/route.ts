import { APP_URL } from "@/lib/constants";
import stripe, { getStripeCustomerId } from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(null, { status: 403 });
  }

  const customerId = await getStripeCustomerId(session.user);
  if (!customerId) {
    return Response.redirect(
      `${APP_URL}/settings/billing?error=Stripe customer id not found`,
    );
  }

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/settings/billing`,
  });

  return Response.redirect(stripeSession.url);
};
