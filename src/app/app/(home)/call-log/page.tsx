"use client";

import Image from "next/image";
import CopyProfileLink from "./copy-profile-link";
import { trpc } from "@/lib/providers/trpc-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import CallLogTable from "./call-log-table";
import { isMultiDArrayEmpty } from "@/lib/utils";

const CallLogPage = () => {
  const {
    data,
    isInitialLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.calls.callLog.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 20) return undefined;
        return lastPage[lastPage.length - 1]?.id;
      },
    },
  );
  const [page, setPage] = useState(0);

  const nextPage = async () => {
    await fetchNextPage();
    setPage((p) => p + 1);
  };

  const previousPage = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  if (isInitialLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data || isMultiDArrayEmpty(data.pages)) {
    return (
      <div className="bg-white border border-neutral-200 flex items-center justify-center flex-col p-4 text-neutral-500 w-full">
        <Image
          src={"/_static/svgs/telephone-call.svg"}
          alt="No Integrations"
          width={300}
          height={300}
          className="pointer-events-none"
        />
        <p className="text-base md:text-lg text-center mt-2 mb-4">
          You haven&apos;t received any calls yet, time to share your profile
          with more people!
        </p>
        <CopyProfileLink />
      </div>
    );
  }

  return (
    <CallLogTable
      page={data.pages[page] ?? []}
      currentPage={page}
      hasNext={hasNextPage ?? false}
      hasPrevious={page > 0}
      nextPage={nextPage}
      previousPage={previousPage}
      fetchingNext={isFetchingNextPage}
    />
  );
};

export default CallLogPage;
