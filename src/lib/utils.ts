import { type ClassValue, clsx } from "clsx";
import { type Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetadataProps {
  title?: string;
  description?: string;
}

export const makeMetadata = ({
  title = "Jumpcal",
  description = "Jumpcal: Revolutionizing Call Scheduling. Effortlessly book and manage calls with Jumpcal's intuitive interface. Say goodbye to time zone confusions and back-to-back meetings. Jump right into seamless scheduling today!",
}: MetadataProps = {}): Metadata => {
  return {
    title,
    icons: "/favicon.ico",
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const firstName = (fullName: string) => {
  if (!fullName) {
    return "";
  }

  return fullName.split(" ")[0];
};

export const isMultiDArrayEmpty = (array: any[][]) => {
  return array.length === 0 || array.every((arr) => arr.length === 0);
};
