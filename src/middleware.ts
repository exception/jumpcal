import { NextResponse, type NextRequest } from "next/server";
import AppMiddleware from "@/lib/middleware/app";
import { isLanding, parse } from "./lib/middleware/utils";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const { domain, path } = parse(req);

  if (isLanding(domain)) {
    return NextResponse.rewrite(new URL(`/jumpcal.io${path}`, req.url));
  }

  return AppMiddleware(req);
}
