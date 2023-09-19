/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/db";
import { env } from "@/env.mjs";
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

    const redirectUri = encodeURI(`${APP_URL}/api/integration/zoom/connect`);
    const authHeader =
      "Basic " +
      Buffer.from(
        env.NEXT_PUBLIC_ZOOM_CLIENT_ID + ":" + env.ZOOM_CLIENT_SECRET,
      ).toString("base64");
    const result = await fetch(
      "https://zoom.us/oauth/token?grant_type=authorization_code&code=" +
        code +
        "&redirect_uri=" +
        redirectUri,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
      },
    );

    if (result.status !== 200) {
      console.error("Zoom integration failed", result.body);
      return Response.redirect(
        `${APP_URL}/settings/integrations?error=Failed to integrate with zoom.`,
      );
    }

    const responseBody = await result.json();
    if (responseBody.error) {
      return Response.redirect(
        `${APP_URL}/settings/integrations?error=${responseBody.error}`,
      );
    }

    responseBody.expiry_date = Math.round(
      Date.now() + responseBody.expires_in * 1000,
    );
    delete responseBody.expires_in;

    await prisma.integration.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        type: "ZOOM",
        keys: responseBody,
      },
    });

    return Response.redirect(`${APP_URL}/settings/integrations`);
  } catch (err) {
    console.error("Failed zoom integration", err);
    return Response.redirect(
      `${APP_URL}/settings/integrations?error=Failed to integrate with zoom.`,
    );
  }
};
