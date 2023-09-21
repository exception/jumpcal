import { prisma } from "@/db";
import { sendEmail } from "@/lib/resend";
import CallSurvey from "@/lib/resend/emails/call-survey";
import { receiver } from "@/lib/upstash";
import { firstName } from "@/lib/utils";
import { z } from "zod";

const bodySchema = z.object({
  callId: z.string(),
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
      include: {
        target: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!call || call.status !== "ANSWERED") {
      return new Response(null, { status: 200 });
    }

    console.log(
      `Sent email to ${call.callerEmail} about their call with ${call.target.name}`,
    );
    await sendEmail({
      to: call.callerEmail,
      subject: `How was your call with ${firstName(call.target.name!) ?? call.target.name}`,
      content: CallSurvey({
        callId,
        callerEmail: call.callerEmail,
        callerName: call.callerName,
        targetName: call.target.name ?? "Unknown",
      }),
    });
  } finally {
    return new Response(null, { status: 200 });
  }
}
