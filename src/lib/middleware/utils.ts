import { type NextRequest } from "next/server";

const LANDING_DOMAINS = new Set(["home.localhost:3000", "jumpcal.com"]);

export const isLanding = (domain: string) => {
  return LANDING_DOMAINS.has(domain) || domain.endsWith(".vercel.app");
};

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host")!;
  domain = domain.replace("www.", "");

  const path = req.nextUrl.pathname;

  const key = decodeURIComponent(path.split("/")[1] ?? "");
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, key, fullKey };
};
