"use client";

import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  title: string;
}

interface Props {
  items: NavItem[];
}

const Navigation = ({ items }: Props) => {
  const path = usePathname();
  const scrolled = useScroll(80);
  const { isMobile } = useMediaQuery();

  return (
    <nav
      className={cn(
        "sticky top-16 px-2 md:px-0 lg:top-20 grid w-full gap-x-2 grid-flow-col py-2 lg:grid-flow-row grid-cols-3 grid-rows-2 md:grid-rows-none md:grid-cols-none lg:space-x-0 lg:space-y-1 md:w-64 grow-0 h-auto transition-all lg:py-0 z-50",
        isMobile && scrolled && "bg-white border-b border-t border-neutral-200",
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            path === item.href ? "bg-neutral-200" : "hover:bg-transparent",
            "justify-start hover:bg-neutral-100 px-2 py-1 grow-0 col-span-1",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
