"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ScheduleModalForm from "./modal-form";
import Link from "next/link";

const NoCalendarTools = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-4 w-full !mt-8">
        <div>
          <h3 className="text-lg font-medium">Scheduling Tools</h3>
          <p className="text-sm text-neutral-400">
            How your callers can schedule time with you when you&apos;re unable
            to answer.
          </p>
        </div>
        <Separator className="w-full" />
        <div className="bg-white border border-neutral-200 flex items-center justify-center flex-col space-y-2 p-4 text-neutral-500 rounded-md">
          <Image
            src={"/_static/svgs/falling.svg"}
            alt="No Integrations"
            width={200}
            height={200}
            className="pointer-events-none"
          />
          <p className="text-base text-center">
            You don&apos;t have any scheduling tools enabled, users won&apos;t
            be able to schedule time with you.
          </p>
          <Button
            icon={<Plus className="w-4 h-4" />}
            size="lg"
            onClick={() => setOpen(true)}
          >
            Why not add one?
          </Button>
        </div>
      </div>
      <Modal open={isOpen} setOpen={setOpen}>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-medium">Add Scheduling Tool</h2>
          <p className="text-sm text-neutral-400">
            Head to Calendly or Cal.com and copy the desired meeting url.
          </p>
          <Link href="/settings/integrations/how-to/cal">
            <p className="text-xs text-neutral-500 font-medium flex items-center hover:underline hover:decoration-dashed hover:underline-offset-4">
              How to get Cal.com meeting link{" "}
              <ArrowRight className="ml-1 h-3 w-3" />
            </p>
          </Link>
          <Link href="/settings/integrations/how-to/calendly">
            <p className="text-xs text-neutral-500 font-medium flex items-center hover:underline hover:decoration-dashed hover:underline-offset-4">
              How to get Calendly meeting link{" "}
              <ArrowRight className="ml-1 h-3 w-3" />
            </p>
          </Link>
          <Separator className="!my-3" />
          <ScheduleModalForm close={() => setOpen(false)} />
        </div>
      </Modal>
    </>
  );
};

export default NoCalendarTools;
