import { env } from "@/env.mjs";
import { type JSXElementConstructor, type ReactElement } from "react";
import { Resend } from "resend";

interface EmailArgs {
  to: string;
  subject: string;
  content: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  isTest?: boolean;
  marketing?: boolean;
}

export const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  content,
  isTest = false,
  marketing,
}: EmailArgs) => {
  return resend.emails.send({
    from: marketing
      ? "Erik from Jumpcal <erik@jumpcal.io>"
      : "Jumpcal <no-reply@jumpcal.io>",
    to: isTest ? "delivered@resend.dev" : to,
    subject,
    react: content,
  });
};
