"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center space-y-4 justify-center bg-neutral-50 py-10">
      <Image
        src={"/_static/svgs/crashed-error.svg"}
        width={400}
        height={400}
        alt="404"
        className="pointer-events-none"
      />
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h3 className="text-xl font-medium">Not Found</h3>
      </div>
      <Button
        size="sm"
        className="w-32 mt-6"
        icon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
