"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  title: string;
};

interface Props {
  items: NavItem[];
}

const Navigation = ({ items }: Props) => {
  const path = usePathname();

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 w-64">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            path === item.href ? "bg-neutral-200" : "hover:bg-transparent",
            "justify-start hover:bg-neutral-100",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
