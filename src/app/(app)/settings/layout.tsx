"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import { Separator } from "@/components/ui/separator";
import Navigation, { NavItem } from "./navigation";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const navItems: NavItem[] = [
  {
    href: "/settings",
    title: "Account",
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
  const currentTab = navItems.find((item) => item.href === pathname);

  return (
    <MaxWidthContainer className="pt-5">
      <div className="flex items-center text-xl font-medium">
        <h1>Settings</h1>
        <ChevronRight className="mx-4 h-5 w-5 flex-shrink-0" />
        <h1>{currentTab?.title}</h1>
      </div>
      {/* <h1 className="text-2xl font-medium">Settings  {currentTab?.title}</h1> */}
      <Separator className="my-5" />
      <div className="flex lg:flex-row lg:space-x-12 flex-col space-y-8 lg:space-y-0">
        <Navigation items={navItems} />
        {children}
      </div>
    </MaxWidthContainer>
  );
};

export default SettingsPage;
