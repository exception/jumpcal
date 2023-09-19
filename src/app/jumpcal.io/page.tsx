import MaxWidthContainer from "@/components/app/max-width-container";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <MaxWidthContainer className="mt-10">
      <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 w-full items-center">
        <div className="flex flex-col space-y-4 shrink-0 w-full lg:w-1/2 text-center lg:text-start">
          <h1 className="text-4xl font-bold">
            Add{" "}
            <span className="font-black underline underline-offset-4 decoration-4 decoration-pink whitespace-pre-wrap">
              instant meetings
            </span>{" "}
            to your calendar scheduling, instantly.
          </h1>
          <p className="text-base text-neutral-500">
            That hot lead is ready to chat right now, seize the opportunity for
            a conversation in the moment.{" "}
          </p>
          <div className="flex flex-row space-x-2 self-center lg:self-start">
            <Input
              type="text"
              maxLength={16}
              minLength={2}
              placeholder="username"
              addOn="jumpcal.io/"
            />
            <Link
              href={`${APP_URL}/signup`}
              className={buttonVariants({ variant: "pink" })}
            >
              Claim Username <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 shrink-0 grow-0 bg-pink h-96"></div>
      </div>
    </MaxWidthContainer>
  );
};

export default LandingPage;
