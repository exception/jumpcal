"use client";

import MaxWidthContainer from "@/components/app/max-width-container";
import Navigation, { type NavItem } from "./navigation";
import Greeter from "./greeter";
import DoNotDisturbToggle from "./do-not-disturb-toggle";
import { Home, PhoneIncoming } from "lucide-react";
import AppLayout from "@/components/app/app-layout";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const items: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Call Log",
    href: "/call-log",
    icon: <PhoneIncoming className="h-4 w-4" />,
  },
];

const HomeLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  const [parentDivRef] = useAutoAnimate();

  return (
    <AppLayout>
      <div className="py-4 bg-white border-b border-b-neutral-200">
        <MaxWidthContainer className="flex justify-between items-center">
          <Greeter />
          <DoNotDisturbToggle />
        </MaxWidthContainer>
      </div>
      <MaxWidthContainer>
        <Navigation items={items} />
        <div className="flex w-full" ref={parentDivRef}>
          {children}
        </div>
      </MaxWidthContainer>
    </AppLayout>
  );
};

export default HomeLayout;
