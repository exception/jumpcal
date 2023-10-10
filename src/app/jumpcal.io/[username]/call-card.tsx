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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/providers/trpc-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PhoneCall, PhoneMissedIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(36),
  email: z
    .string()
    .email({
      message: "Please provide a valid email.",
    })
    .min(1, {
      message: "Email is required.",
    }),
  reason: z
    .string()
    .min(1, {
      message: "Call reason is required.",
    })
    .max(1000),
});

interface Props {
  target: string;
  name: string;
}

const CallCard = ({ target, name }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [callId, setCallId] = useState("");
  const [canceled, setCanceled] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: session?.user.email ?? "",
      fullName: session?.user.name ?? "",
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const requestCall = trpc.calls.requestCall.useMutation({
    onSuccess(call) {
      setCallId(call.id);
    },
  });

  const { data: call } = trpc.calls.callStatus.useQuery(
    {
      callId,
    },
    {
      enabled: !!callId && !canceled,
      refetchInterval: 5_000, // 5 seconds
      refetchIntervalInBackground: true,
    },
  );

  const requestCallHandler = (form: z.infer<typeof formSchema>) => {
    requestCall.mutate({
      target,
      caller: {
        email: form.email,
        name: form.fullName,
        reason: form.reason,
      },
    });
  };

  useEffect(() => {
    // ignore any subsequent updates, we no longer care.
    if (canceled) return;

    if (call?.status === "MISSED" || call?.status === "REJECTED") {
      setCanceled(true);
    } else if (call?.status === "ANSWERED") {
      if (call?.host?.link) {
        void router.push(call.host.link);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, canceled]);

  if (!callId) {
    return (
      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit(requestCallHandler)}
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Full Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@jumpcal.io" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call Reason</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What you want to chat about."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="self-end"
            icon={<PhoneCall className="h-4 w-4" />}
            loading={requestCall.isLoading}
            disabled={!form.formState.isValid}
          >
            Call
          </Button>
        </form>
      </Form>
    );
  }

  if (call?.status === "MISSED" || call?.status === "REJECTED") {
    return (
      <div className="flex flex-row items-center gap-x-4 pt-2 px-2">
        <PhoneMissedIcon className="h-10 w-10 text-neutral-900" />
        <div className="flex flex-col">
          <p className="text-lg text-neutral-900">
            Sorry, {name} wasn&apos;t able to answer.
          </p>
          <p className="text-sm text-neutral-400">
            Don&apos;t worry though, you can schedule a call using the cards
            below!
          </p>
        </div>
      </div>
    );
  }

  if (call?.status === "PENDING") {
    return (
      <div className="flex flex-row items-center gap-x-4 pt-2 px-2">
        <Loader2 className="h-10 w-10 text-neutral-400 animate-spin" />
        <div className="flex flex-col">
          <p className="text-lg text-neutral-900">
            Waiting for {name} to accept...
          </p>
          <p className="text-sm text-neutral-400">
            You&apos;ll be automatically redirected once they accept.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-x-4 pt-2 px-2">
      <Loader2 className="h-10 w-10 text-neutral-400 animate-spin" />
      <p className="text-lg text-neutral-900">Redirecting you...</p>
    </div>
  );
};

export default CallCard;
