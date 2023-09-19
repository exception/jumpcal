import MaxWidthContainer from "@/components/app/max-width-container";
import { buttonVariants } from "@/components/ui/button";
import JumpcalLogoFull from "@/components/ui/icons/jumpcal-logo-full";
import { APP_URL } from "@/lib/constants";
import Link from "next/link";

const LandingLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className={"min-h-screen w-full bg-neutral-50"}>
      <div className="sticky left-0 right-0 top-0 z-20">
        <MaxWidthContainer>
          <div className="flex justify-between items-center h-16">
            <Link href={"/"}>
              <JumpcalLogoFull className="active:scale-95 transition-all" />
            </Link>
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
          </div>
        </MaxWidthContainer>
      </div>
      {children}
    </div>
  );
};

export default LandingLayout;
