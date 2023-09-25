import { type ClassValue, clsx } from "clsx";
import { type Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { APP_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetadataProps {
  title?: string;
  description?: string;
}

export const makeMetadata = ({
  title = "Jumpcal",
  description = "Jumpcal: Revolutionizing Call Scheduling. Effortlessly book and manage calls with Jumpcal's intuitive interface. Say goodbye to timezone confusions and back-to-back meetings. Jump right into seamless scheduling today!",
}: MetadataProps = {}): Metadata => {
  return {
    title,
    metadataBase: new URL(APP_URL),
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

export const firstName = (fullName: string) => {
  if (!fullName) {
    return "";
  }

  return fullName.split(" ")[0];
};

export const isMultiDArrayEmpty = (array: any[][]) => {
  return array.length === 0 || array.every((arr) => arr.length === 0);
};
