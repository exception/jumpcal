"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/providers/trpc-provider";
import { Pencil, SaveIcon, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";

const UploadAvatarRow = () => {
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const [imageContent, setImageContent] = useState<string | undefined>();
  const uploadAvatar = trpc.users.updateAvatar.useMutation({
    async onSuccess() {
      await update();
      if (!imageContent) {
        toast({
          title: "Removed avatar",
          description: "You have successfully removed your avatar!",
        });
      } else {
        toast({
          title: "Updated avatar",
          description: "You have successfully updated your avatar!",
        });
      }
      setImageContent(undefined);
    },
    onError() {
      toast({
        title: "Upload failed",
        description: "Something went wrong while uploading your avatar!",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    setImageContent(
      session?.user.image ??
        `https://api.dicebear.com/7.x/lorelei/svg?seed=${session?.user.name}&scale=80&backgroundColor=ec4899`,
    );
  }, [session]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageContent(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImageContent],
  );

  return (
    <div className="flex w-full flex-col gap-y-2 mb-4">
      <p className="text-sm font-medium leading-none">Avatar</p>
      <Dropzone
        maxFiles={1}
        multiple={false}
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg", ".jpeg"],
        }}
        onDrop={handleDrop}
        onDropRejected={(fileRejections) => {
          const errorCode = fileRejections[0]!.errors[0]!.code;
          if (errorCode === "file-too-large") {
            toast({
              title: "File not supported!",
              description: "File is too large, max size is 3MB.",
              variant: "destructive",
            });
          } else if (errorCode === "file-invalid-type") {
            toast({
              title: "File not supported!",
              description:
                "This file type is not supported, we only support .jpg and .png.",
              variant: "destructive",
            });
          }
        }}
        maxSize={3_000_000}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="border-neutral-200 group relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border hover:cursor-pointer hover:bg-neutral-500 hover:opacity-75 opacity-100 active:scale-95 transition-all"
            {...getRootProps()}
          >
            <Image
              className="h-full w-full object-cover"
              src={imageContent ?? session?.user.image ?? ""}
              alt="Your Avatar"
              width={128}
              height={128}
              priority
              unoptimized
            />

            <div className="absolute left-0 top-0 h-full w-full flex opacity-0 items-center justify-center text-neutral-100 transition-all group-hover:opacity-100">
              <Pencil className="h-6 w-6" />
            </div>
            <input id="upload-image-form" {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      <div className="flex w-full justify-between items-center">
        <p className="text-xs md:text-sm text-neutral-400 max-w-md">
          Max file size: <span className="font-medium">3MB</span>, only .jpg and
          .png are supported. Default avatars provided by Dicebear.
        </p>
        <div className="flex self-end items-center space-x-2">
          {session?.user.image && (
            <Button
              disabled={uploadAvatar.isLoading}
              loading={uploadAvatar.isLoading}
              variant="outline"
              size="sm"
              icon={<Trash className="h-4 w-4" />}
              onClick={() => {
                uploadAvatar.mutate({
                  image: undefined,
                });
              }}
            >
              Remove
            </Button>
          )}
          <Button
            disabled={!imageContent || imageContent.includes("dicebear")}
            loading={uploadAvatar.isLoading}
            variant="default"
            size="sm"
            icon={<SaveIcon className="h-4 w-4" />}
            onClick={() =>
              uploadAvatar.mutate({
                image: imageContent,
              })
            }
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadAvatarRow;
