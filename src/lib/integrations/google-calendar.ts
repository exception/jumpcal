/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { type Integration } from "@prisma/client";
import { google } from "googleapis";
import { z } from "zod";
import { APP_URL } from "../constants";

const validGoogleKeys = z.object({
  scope: z.string(),
  token_type: z.literal("Bearer"),
  expiry_date: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export const googleAuth = (integration: Integration) => {
  const getGoogleAuth = () => {
    const oauthClient = new GoogleAuthWithExpiration(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${APP_URL}/api/integration/google/connect`,
    );
    oauthClient.setCredentials(validGoogleKeys.parse(integration.keys));
    return oauthClient;
  };

  const refreshToken = async (
    auth: Awaited<ReturnType<typeof getGoogleAuth>>,
  ) => {
    try {
      const { res } = await auth.refreshAccessToken();
      const keys = res?.data;

      await prisma.integration.update({
        where: {
          userId_type: {
            userId: integration.userId,
            type: integration.type,
          },
        },
        data: {
          keys,
        },
      });

      auth.setCredentials(validGoogleKeys.parse(keys));
      return auth;
    } catch (err) {
      console.error("Invalid google response", err);
    }

    return auth;
  };

  return {
    getAuthClient: async () => {
      const googleAuth = getGoogleAuth();
      const expired = googleAuth.isTokenExpiring();

      return expired ? refreshToken(googleAuth) : Promise.resolve(googleAuth);
    },
  };
};

export const isUserBusy = async (integration: Integration) => {
  const googleClient = googleAuth(integration);
  const authClient = await googleClient.getAuthClient();

  const calendar = google.calendar({
    version: "v3",
    auth: authClient,
  });

  const now = new Date();
  const timeMin = now.toISOString();

  // Consider the user's availability for the next 15 minutes (or adjust as needed)
  now.setMinutes(now.getMinutes() + 15);
  const timeMax = now.toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: "primary" }],
    },
  });

  const busyArray = res.data.calendars?.primary?.busy;
  return busyArray && busyArray.length > 0;
};

class GoogleAuthWithExpiration extends google.auth.OAuth2 {
  isTokenExpiring() {
    return super.isTokenExpiring();
  }
}
