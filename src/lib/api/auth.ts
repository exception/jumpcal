import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { SafeParseReturnType, ZodError, ZodType } from "zod";

interface ApiHandler<T> {
  (req: NextApiRequest, res: NextApiResponse, session: Session, body: T): any;
}

export const withAuthUser = <T>(
  handler: ApiHandler<T>,
  schema?: ZodType<T>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).end("Unauthorized.");
    }

    let parsedBody: T;

    if (schema) {
      const result: SafeParseReturnType<typeof schema, T> = schema.safeParse(
        req.body,
      );
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      parsedBody = result.data;
    } else {
      parsedBody = req.body as T;
    }

    return handler(req, res, session, parsedBody);
  };
};
