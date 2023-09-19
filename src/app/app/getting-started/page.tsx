import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import OnboardingForm from "./form";

const GettingStarted = () => {
  return (
    <div className="flex flex-col space-y-2 z-10 text-center w-full max-w-4xl mx-auto mb-auto px-5">
      <div className=" mb-5 text-left max-w-md space-y-2">
        <h1 className="text-2xl font-medium">Welcome to Jumpcal!</h1>
        <h3 className="text-base font-normal">
          We just need some information to get you started, you can modify this
          later on.
        </h3>
      </div>
      <Card>
        <CardContent className="flex flex-col text-left gap-y-2 pt-4">
          <Suspense
            fallback={
              <>
                <Skeleton className="w-full h-6 bg-neutral-200" />
                <Skeleton className="w-1/2 h-6 bg-neutral-200" />
                <Skeleton className="w-full h-6 bg-neutral-200" />
              </>
            }
          >
            <OnboardingForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStarted;
