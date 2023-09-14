import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "lucide-react";

interface Props {
  name: string;
  image: string | null;
  description: string;
}

const UserHeader = ({ name, image, description }: Props) => {
  return (
    <div className="flex flex-col space-y-2 items-center">
      <Avatar className="h-32 w-32 hover:scale-105 transition-all">
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
      <h1 className="font-medium text-3xl">{name}</h1>
      {description && (
        <p className="font-normal text-base text-neutral-400">{description}</p>
      )}
    </div>
  );
};

export default UserHeader;
