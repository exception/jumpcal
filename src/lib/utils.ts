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
  }
}