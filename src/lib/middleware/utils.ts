import { type NextRequest } from "next/server";

const HOME_HOSTNAMES = new Set(["localhost"]);

export const isHomeHostname = (domain: string) => {
  return HOME_HOSTNAMES.has(domain) || domain.endsWith(".vercel.app");
};

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host")!;
  domain = domain.replace("www.", ""); // remove www. from domain
  //if (isHomeHostname(domain)) domain = "dub.sh"; // if domain is a home hostname, set it to dub.sh

  const path = req.nextUrl.pathname;

  const key = decodeURIComponent(path.split("/")[1] ?? "");
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, key, fullKey };
};
