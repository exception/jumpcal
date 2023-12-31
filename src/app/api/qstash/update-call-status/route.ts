import { prisma } from "@/db";
import { receiver } from "@/lib/upstash";
import { z } from "zod";

const bodySchema = z.object({
  callId: z.string()
});

export async function POST(req: Request) {
  const body = await req.json();

  if (process.env.VERCEL === "1") {
    const isValid = await receiver.verify({
      signature: req.headers.get("Upstash-Signature") ?? "",
      body: JSON.stringify(body),
    });

    if (!isValid) {
      return new Response("Upstash Request Unauthorized", { status: 401 });
    }
  }

  const schema = bodySchema.parse(body);
  const { callId } = schema;

  try {
    const call = await prisma.call.findUnique({
      where: {
        id: callId,
      },
    });

    if (!call || call.status !== "PENDING") {
      return new Response(null, { status: 200 });
    }

    await prisma.call.update({
      where: {
        id: callId,
      },
      data: {
        status: "MISSED",
      },
    });
  } finally {
    return new Response(null, { status: 200 });
  }
}
