import { type NextRequest, NextResponse } from "next/server";
import { parse } from "./utils";
import { getToken } from "next-auth/jwt";
import { type User } from "@prisma/client";

const RESTRICTED_KEYS = new Set([
  "",
  "call-log",
  "getting-started",
  "settings",
]);

const AppMiddleware = async (req: NextRequest) => {
  const { path, key } = parse(req);
  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    email?: string;
    user?: User;
  };

  console.log("path", path, key, session.email);

  if (!session?.email && RESTRICTED_KEYS.has(key)) {
    return NextResponse.redirect(
      new URL(
        `/signin${path !== "/" ? `?next=${encodeURIComponent(path)}` : ""}`,
        req.url,
      ),
    );
  } else if (session?.email) {
    if (!session.user?.username && path !== "/getting-started") {
      return NextResponse.redirect(new URL("/getting-started", req.url));
    } else if (session.user?.username && path === "/getting-started") {
      return NextResponse.redirect(new URL(`/`, req.url));
    } else if (path === "/signin" || path === "/signup") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }

  return NextResponse.rewrite(new URL(`${path}`, req.url));
};

export default AppMiddleware;
