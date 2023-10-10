"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import { buttonVariants } from "@/components/ui/button";
import JumpcalLogoFull from "@/components/ui/icons/jumpcal-logo-full";
import { APP_URL } from "@/lib/constants";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

const MarketingNavigation = () => {
  const hasScrolled = useScroll(30);
  const { status } = useSession();

  return (
    <div
      className={cn(
        "sticky left-0 right-0 top-0 z-20 transition-all",
        hasScrolled && "bg-white border-b border-b-neutral-200",
      )}
    >
      <MaxWidthContainer>
        <div className="flex justify-between items-center h-16">
          <Link href={"/"}>
            <JumpcalLogoFull className="active:scale-95 transition-all" />
          </Link>
          {status !== "authenticated" && (
            <div className="flex space-x-2">
              <Link
                className={buttonVariants({ variant: "link" })}
                href={`${APP_URL}/signin`}
              >
                Sign In
              </Link>
              <Link
                className={buttonVariants({ variant: "default" })}
                href={`${APP_URL}/signup`}
              >
                Sign Up
              </Link>
            </div>
          )}
          {status === "authenticated" && (
            <Link
              className={buttonVariants({ variant: "default" })}
              href={`${APP_URL}`}
            >
              Go To App
            </Link>
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
};

export default MarketingNavigation;
