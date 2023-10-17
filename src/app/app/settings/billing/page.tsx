"use client";

import SettingsContainer from "../settings-container";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { ExternalLink } from "lucide-react";
import Usage from "./usage";
import { Separator } from "@/components/ui/separator";

const BillingSettings = () => {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get("payment_status");
  const error = searchParams?.get("error");

  const successfulPayment = paymentStatus === "paid";

  useEffect(() => {
    if (successfulPayment) {
      void update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successfulPayment]);

  return (
    <SettingsContainer
      title="Billing"
      description="Manage your billing via Stripe."
    >
      {error && (
        <div className="bg-red-50 p-4 border border-red-300 rounded-md">
          <div className="space-y-2">
            <h3 className="text-base text-red-500 font-medium">
              Billing Error
            </h3>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}
      <div className="bg-white p-4 border border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-between rounded-md">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Manage Billing</h3>
          <p className="text-neutral-400 text-sm">
            View and manage your billing settings.
          </p>
        </div>
        <Link
          href={`${APP_URL}/api/stripe/billing`}
          target="_blank"
          className={buttonVariants({
            variant: "default",
            className: "mt-2 md:mt-0",
          })}
        >
          <ExternalLink className="h-4 w-4" />
          Billing Page
        </Link>
      </div>
      <Separator />
      <Usage />
    </SettingsContainer>
  );
};

export default BillingSettings;
