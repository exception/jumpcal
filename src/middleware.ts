import { type NextRequest } from "next/server";
import AppMiddleware from "@/lib/middleware/app";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function middleware(req: NextRequest) {
  return AppMiddleware(req);
}
