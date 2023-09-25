import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { type User } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const getStripeCustomerId = async (user: User): Promise<string> => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customersResponse = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  let customerId: string | null = null;

  if (customersResponse.data[0]?.id) {
    customerId = customersResponse.data[0]?.id;
  } else {
    const customer = await stripe.customers.create({ email: user.email });
    customerId = customer.id;
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeCustomerId: customerId,
    },
  });

  return customerId;
};

export const getCustomerAndCheckoutSession = async (
  checkoutSessionId: string,
) => {
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(checkoutSessionId);
  const customerOrCustomerId = checkoutSession.customer;
  let customerId = null;

  if (!customerOrCustomerId) {
    return { checkoutSession, stripeCustomer: null };
  }

  if (typeof customerOrCustomerId === "string") {
    customerId = customerOrCustomerId;
  } else if (customerOrCustomerId.deleted) {
    return { checkoutSession, stripeCustomer: null };
  } else {
    customerId = customerOrCustomerId.id;
  }
  const stripeCustomer = await stripe.customers.retrieve(customerId);
  if (stripeCustomer.deleted) {
    return { checkoutSession, stripeCustomer: null };
  }
  return { stripeCustomer, checkoutSession };
};

export default stripe;
