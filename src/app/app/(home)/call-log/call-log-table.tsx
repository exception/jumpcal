import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { type Call } from "@prisma/client";
import { type VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";

interface Props {
  page: Call[];
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: () => void;
  previousPage: () => void;
  fetchingNext: boolean;
}

const badgeVariant = (
  status: Call["status"],
): VariantProps<typeof badgeVariants>["variant"] => {
  switch (status) {
    case "MISSED": {
      return "yellow";
    }
    case "ANSWERED": {
      return "green";
    }
    case "REJECTED": {
      return "red";
    }
  }
};

const CallLogTable = ({
  page,
  hasNext,
  hasPrevious,
  nextPage,
  previousPage,
  fetchingNext,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="rounded-md divide-y divide-neutral-200 bg-white flex flex-col border border-neutral-200">
        {page.map((call) => {
          const variant = badgeVariant(call.status);
          return (
            <div
              key={`incoming-call-${call.id}`}
              className="p-4 w-full flex flex-row justify-between items-center"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row space-x-2 items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      alt={call.callerName}
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${call.callerEmail}&scale=80&backgroundColor=ec4899`}
                    />
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-neutral-950">
                      {call.callerName}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {call.callerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="grow-0">
                    <Badge variant={variant}>{call.status}</Badge>
                  </div>
                  <p className="text-xs font-medium text-neutral-950">
                    Called {DateTime.fromJSDate(call.createdAt).toRelative()}.
                  </p>
                </div>
              </div>
              {call.status === "ANSWERED" && (
                <Link
                  className={buttonVariants({ size: "sm" })}
                  href={`mailto:${call.callerEmail}?subject=Follow-up to our call&body=Hey ${call.callerName},\n`}
                  target="_blank"
                >
                  <Mail className="h-4 w-4" />
                  Follow Up
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <div className="self-end flex justify-between space-x-2 mt-2">
        {hasPrevious && (
          <Button
            onClick={() => previousPage()}
            icon={<ArrowLeft className="h-4 w-4" />}
            variant="outline"
            size="sm"
          >
            Previous Page
          </Button>
        )}
        {hasNext && (
          <Button
            onClick={() => nextPage()}
            loading={fetchingNext}
            icon={<ArrowRight className="h-4 w-4" />}
            variant="outline"
            size="sm"
          >
            Next Page
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallLogTable;
