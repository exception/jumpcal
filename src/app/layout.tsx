// app/layout.tsx
import "./globals.css";

import { type Session } from "next-auth";
import Providers from "./providers";
import { inter } from "@/lib/fonts";
import { cn, makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata();

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable)}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
