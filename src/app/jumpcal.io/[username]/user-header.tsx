import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type Layout } from "@prisma/client";

interface Props {
  name: string;
  image: string | null;
  description: string;
  layout: Layout;
}

const UserHeader = ({
  name,
  image,
  description,
  layout = "VERTICAL",
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 shrink-0 text-center",
        layout === "VERTICAL" ? "items-center" : "items-start",
      )}
    >
      <Avatar
        className={cn(
          "hover:scale-105 transition-all",
          layout === "VERTICAL" ? "h-32 w-32" : "h-40 w-40",
        )}
      >
        <AvatarImage
          src={
            image ??
            `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}&scale=80&backgroundColor=ec4899`
          }
          className="object-cover"
        />
        <AvatarFallback>
          <Skeleton className="h-20 w-20" />
        </AvatarFallback>
      </Avatar>
      <h1
        className={cn(
          "font-medium",
          layout === "VERTICAL" ? "text-3xl" : "text-2xl",
        )}
      >
        {name}
      </h1>
      {description && (
        <p className="font-normal text-base text-neutral-400">{description}</p>
      )}
    </div>
  );
};

export default UserHeader;
