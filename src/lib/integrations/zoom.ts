/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { type Call, type Integration } from "@prisma/client";
import { z } from "zod";

const validZoomKeys = z.object({
  scope: z.string(),
  token_type: z.literal("bearer"),
  expiry_date: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});

export const zoomAuth = (integration: Integration) => {
  const refreshToken = async (token: string) => {
    const authHeader =
      "Basic " +
      Buffer.from(
        env.NEXT_PUBLIC_ZOOM_CLIENT_ID + ":" + env.ZOOM_CLIENT_SECRET,
      ).toString("base64");

    const response = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: token,
        grant_type: "refresh_token",
      }),
    });

    const body = await response.json();
    if (response.status !== 200) {
      throw new Error("Invalid Zoom response.");
    }

    body.expiry_date = Math.round(
      Date.now() + body.expires_in * 1000,
    );
    delete body.expires_in;

    const zoomRes = validZoomKeys.parse(body);
    

    await prisma.integration.update({
      where: {
        userId_type: {
          userId: integration.userId,
          type: integration.type
        }
      },
      data: {
        keys: zoomRes
      }
    })

    return zoomRes.access_token;
  };

  return {
    getToken: async () => {
      const keys = validZoomKeys.safeParse(integration.keys);
      if (!keys.success) {
        throw new Error("Invalid Zoom keys.");
      }

      const isValid = keys.data.expiry_date > Date.now();
      return isValid
        ? Promise.resolve(keys.data.access_token)
        : refreshToken(keys.data.refresh_token);
    },
  };
};

export const meetingBody = (call: Call, receiver: string) => {
  return {
    topic: `Call between ${receiver} and ${call.callerName}`,
    type: 1,
    agenda: `${call.callerName} (${call.callerEmail}) wants to talk about "${call.callerReason}"`,
    password: "",
    settings: {
      waiting_room: false,
      join_before_host: true,
      host_video: true,
      participant_video: true,
      mute_upon_entry: false,
      approval_type: 2,
      audio: "both",
      auto_recording: "none",
      enforce_login: false,
    },
  };
};
