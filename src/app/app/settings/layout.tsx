"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import { Separator } from "@/components/ui/separator";
import Navigation, { type NavItem } from "./navigation";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AppLayout from "@/components/app/app-layout";
import React, { useMemo } from "react";
import { capitalize } from "radash";

const navItems: NavItem[] = [
  {
    href: "/settings",
    title: "Account",
  },
  {
    href: "/settings/billing",
    title: "Billing",
  },
  {
    href: "/settings/availability",
    title: "Availability",
  },
  {
    href: "/settings/integrations",
    title: "Integrations",
  },
  {
    href: "/settings/notifications",
    title: "Notifications",
  },
];

const SettingsPage = ({ children }: React.PropsWithChildren<unknown>) => {
  const pathname = usePathname();

  const breadCrumb = useMemo(() => {
    const crumbs = pathname?.slice(1).split("/");
    if (!crumbs) return <></>;

    return crumbs.map((crumb, index) => (
      <React.Fragment key={index}>
        <h1 className="capitalize">{capitalize(crumb.toLowerCase())}</h1>
        {index !== crumbs.length - 1 && (
          <ChevronRight className="mx-2 h-3 w-3 md:mx-4 md:h-5 md:w-5 flex-shrink-0" />
        )}
      </React.Fragment>
    ));
  }, [pathname]);

  return (
    <AppLayout>
      <MaxWidthContainer className="pt-5">
        <div className="flex items-center text-base md:text-xl font-medium">
          {breadCrumb}
        </div>
        {/* <h1 className="text-2xl font-medium">Settings  {currentTab?.title}</h1> */}
        <Separator className="my-5" />
        <div className="flex items-start lg:flex-row lg:space-x-12 flex-col space-y-8 lg:space-y-0">
          <Navigation items={navItems} />
          {children}
        </div>
      </MaxWidthContainer>
    </AppLayout>
  );
};

export default SettingsPage;
