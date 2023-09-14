import { env } from "@/env.mjs";
import { Client, Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

const qstash = new Client({
  token: env.QSTASH_CLIENT_TOKEN,
  baseUrl: "https://qstash.upstash.io/v2/publish/"
});

export { receiver, qstash };
