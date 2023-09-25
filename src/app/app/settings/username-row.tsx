/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { APP_URL } from "@/lib/constants";
import { trpc } from "@/lib/providers/trpc-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const onSubmit = (form: z.infer<typeof formSchema>) => {
    if (usernameIsPremium && !session?.user.isPremium) {
      const redirectUri = `${APP_URL}/api/stripe/upgrade?username=${form.username}`;
      router.push(redirectUri);
    } else {
      updateUsername.mutate({
        username,
      });
    }
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
  );
};

export default UsernameRow;
