"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
}

interface Props {
  items: NavItem[];
}

const Navigation = ({ items }: Props) => {
  const path = usePathname();

  return (
    <nav className="flex space-x-2 my-4 items-start">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            path === item.href ? "bg-neutral-200" : "hover:bg-transparent",
            "justify-start hover:bg-neutral-100 !px-2 !py-1 grow-0 flex space-x-1",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
