import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetadataProps {
  title?: string;
}

export const makeMetadata = ({ title = "Jumpcal" }: MetadataProps = {}): Metadata => {
  return {
    title,
    icons: "/favicon.ico"
  }
}

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
