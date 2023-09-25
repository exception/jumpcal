import { prisma } from "@/db";

export const checkPremiumUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) return { available: false };

  const isPremium = username.length <= 4;
  return { available: true, premium: isPremium };
};
