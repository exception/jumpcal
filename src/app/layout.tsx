// app/layout.tsx
import "./globals.css";

import { type Session } from "next-auth";
import Providers from "./providers";
import { inter } from "@/lib/fonts";
import { cn, makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata();

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
