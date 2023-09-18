import MaxWidthContainer from "@/components/app/max-width-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <MaxWidthContainer className="mt-10">
      <div className="flex flex-row space-x-5 w-full items-center">
        <div className="flex flex-col space-y-2 shrink-0 w-1/2">
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
          <div className="flex flex-row space-x-2 w-full">
            <Input
              type="text"
              maxLength={16}
              minLength={2}
              placeholder="username"
              addOn="jumpcal.com/"
            />
            <Button variant={"pink"}>
              Claim Username <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex w-1/2 shrink-0 grow-0 bg-pink h-96"></div>
      </div>
    </MaxWidthContainer>
  );
};

export default LandingPage;
