"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import { useSession } from "next-auth/react";

interface Props {
  id: string;
}

const OwnProfileBanner = ({ id }: Props) => {
  const { data: session } = useSession();

  if (!session || session.user.id !== id) return <></>;

  return (
    <div className="py-4 bg-neutral-100 border-t border-b border-neutral-200">
      <MaxWidthContainer className="flex items-center justify-center">
        <p className="text-neutral-500 font-medium text-center text-sm md:text-base">
          You are viewing your own profile. Calling won&apos;t be available.
        </p>
      </MaxWidthContainer>
    </div>
  );
};

export default OwnProfileBanner;
