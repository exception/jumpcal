/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { google } from "googleapis";
import { APP_URL } from "@/lib/constants";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { z } from "zod";

const queryParams = z.object({
  code: z.string(),
});

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { code } = queryParams.parse(Object.fromEntries(url.searchParams));
    if (!code) {
        return new Response("Code must be present", { status: 400 });
    }

    const redirectUri = encodeURI(`${APP_URL}/api/integration/google/connect`);
    const oAuth2Client = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);

    const token = await oAuth2Client.getToken(code);

    await prisma.integration.create({
        data: {
            type: "CALENDAR_GCAL",
            keys: token.res?.data ,
            user: {
                connect: {
                    id: session.user.id
                }
            }
        }
    });

    return Response.redirect(`${APP_URL}/settings/integrations`);
  } catch (err) {
    return Response.redirect(
      `${APP_URL}/settings/integrations?error=Failed to integrate with zoom.`,
    );
  }
};
