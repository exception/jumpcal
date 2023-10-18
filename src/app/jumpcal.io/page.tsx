"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_URL } from "@/lib/constants";
import { ReactNebula } from "@flodlc/nebula";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

const LandingPage = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-0 w-full">
        <ReactNebula
          config={{
            bgColor: "rgb(250,250,250)",
            starsColor: "#000000",
            sunScale: 0,
            planetsScale: 0,
            nebulasIntensity: 1,
            cometFrequence: 100,
            starsCount: 200,
            starsRotationSpeed: 10,
          }}
        />
      </div>
      <MaxWidthContainer className="mt-10">
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 w-full items-center z-10">
          <div className="flex flex-col space-y-4 shrink-0 w-full lg:w-1/2 text-center lg:text-start z-10">
            <h1 className="text-2xl lg:text-4xl font-medium">
              <Balancer>
                Add{" "}
                <span className="font-display underline underline-offset-4 decoration-4 decoration-pink whitespace-pre-wrap">
                  instant meetings
                </span>{" "}
                to your calendar scheduling, instantly.
              </Balancer>
            </h1>
            <p className="text-sm lg:text-base text-neutral-500">
              That hot lead is ready to chat right now, seize the opportunity
              for a conversation in the moment.{" "}
            </p>
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 self-center lg:self-start w-full sm:w-auto">
              <Input
                type="text"
                maxLength={16}
                minLength={2}
                placeholder="username"
                addOn="jumpcal.io/"
              />
              <Link
                href={`${APP_URL}/signup`}
                className={buttonVariants({
                  variant: "pink",
                  className: "shrink-0",
                })}
              >
                Claim Username <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/2 shrink-0 grow-0 h-auto items-center text-center space-y-2 lg:items-end z-10">
            <Image
              height={507}
              width={412}
              className="h-[507px] w-[412px] pointer-events-none object-cover"
              alt="Landing Graphic"
              src={"/_static/landing_graphic.png"}
              priority
              unoptimized
            />
            <p className="text-xs lg:text-sm text-neutral-500 max-w-[400px]">
              You can call your local store or electrician right now, so why not
              your local SaaS seller?
            </p>
          </div>
        </div>
      </MaxWidthContainer>
    </>
  );
};

export default LandingPage;
