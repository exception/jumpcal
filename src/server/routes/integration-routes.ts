import { APP_URL } from "@/lib/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { google } from "googleapis";
import { env } from "@/env.mjs";

const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

export const integrationRoutes = createTRPCRouter({
  generateGoogleOAuthUrl: protectedProcedure.mutation(() => {
    const redirectUri = `${APP_URL}/api/integration/google/connect`;

    console.log("redirect uri", redirectUri);

    const oauth2Client = new google.auth.OAuth2({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri,
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });

    return authUrl;
  }),
});
