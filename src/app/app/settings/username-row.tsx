/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { APP_URL } from "@/lib/constants";
import { trpc } from "@/lib/providers/trpc-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { debounce } from "radash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be longer than 1 character.")
    .max(16),
});
const UsernameRow = () => {
  const { data: session, update } = useSession();
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(false);
  const [usernameIsPremium, setUsernameIsPremium] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: session?.user.username ?? "",
    },
  });

  const updateUsername = trpc.users.update.useMutation({
    async onSuccess() {
      await update({ username });
      toast({
        title: "Username has been changed successfully!",
      });
      setModalOpen(false);
    },
  });

  const usernameAvailable = trpc.users.usernameAvailability.useMutation({
    onSuccess(data) {
      setUsernameIsAvailable(data.available);
      setUsernameIsPremium(data.premium ?? false);
      if (!data.available && username !== session?.user.username) {
        form.setError("username", { message: "Username already taken!" });
      }
    },
  });

  const username = form.watch("username");

  const onSubmit = () => {
    setModalOpen(true);
  };

  const checkAvailable = useMemo(
    () =>
      debounce({ delay: 150 }, (username: string) => {
        usernameAvailable.mutate({ username });
      }),
    [session?.user.username],
  );

  // sometimes it takes a while to load the username
  useEffect(() => {
    if (!form.getValues().username && session?.user.username) {
      form.setValue("username", session.user.username);
    }
  }, [session?.user.name]);

  useEffect(() => {
    if (!username) {
      checkAvailable.cancel();
      return;
    }

    checkAvailable(username);
  }, [session?.user.username, username]);

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    addOn="jumpcal.io/"
                    placeholder="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(usernameIsAvailable || usernameIsPremium) &&
            username !== session?.user.username &&
            form.formState.isValid && (
              <Button
                size="sm"
                className="self-end transition-all"
                variant={
                  usernameIsPremium && !session?.user.isPremium
                    ? "pink"
                    : "default"
                }
                icon={
                  usernameIsPremium &&
                  !session?.user.isPremium && <Star className="h-4 w-4" />
                }
              >
                Update
              </Button>
            )}
        </form>
      </Form>
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <div className="flex flex-col space-y-2 w-full">
          <h2 className="text-lg font-medium">Change username</h2>
          <p className="text-sm text-neutral-400">
            You are about to change your username
          </p>
          <Separator className="!my-3" />
          <div className="flex flex-row space-x-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            {usernameIsPremium && !session?.user.isPremium ? (
              <Link
                href={`${APP_URL}/api/stripe/upgrade?username=${username}`}
                className={buttonVariants({
                  variant: "pink",
                  className: "!w-full",
                })}
              >
                <Star className="h-4 w-4" /> Update
              </Link>
            ) : (
              <Button
                variant="default"
                loading={updateUsername.isLoading}
                className="w-full"
                onClick={() =>
                  updateUsername.mutate({
                    username,
                  })
                }
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UsernameRow;
