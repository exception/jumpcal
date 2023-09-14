"use client";

import { useSession } from "next-auth/react";
import IntegrationCard from "../integrations/integration-card";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/providers/trpc-provider";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  phoneNumber: z.string().min(1),
  code: z.string().max(6).optional(),
});

const SmsNotification = () => {
  const { data: session, update, status } = useSession();
  const [enabling, setEnabling] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const code = form.watch("code");

  const sendCode = trpc.notifications.sendVerifyCode.useMutation({
    onSuccess(data) {
      if (data) {
        setSmsSent(true);
      }
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          "We were unable to send your verification code, please try again later.",
      });
    },
  });

  const verifyCode = trpc.notifications.verifyTwilioCode.useMutation({
    async onSuccess({ status }) {
      if (status === "verified") {
        await update();
        setEnabling(false);
        toast({
          title: "SMS Enabled",
          description:
            "Jumpcal will now send you SMS notifications about incoming call requests.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "The code you provided was not valid.",
        });
        form.setValue("code", undefined);
        setSmsSent(false);
      }
    },
  });

  const removeSms = trpc.notifications.removeSms.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "SMS Disabled",
        description:
          "You will no longer receive notifications about incoming calls via SMS",
      });
    },
  });

  useEffect(() => {
    if (smsSent) {
      form.register("code");
    }
  }, [smsSent]);

  const handleSubmit = (form: z.infer<typeof formSchema>) => {
    if (!smsSent) {
      sendCode.mutate({
        phone: form.phoneNumber,
      });
    } else {
      verifyCode.mutate({
        phone: form.phoneNumber,
        code: form.code!,
      });
    }
  };

  return (
    <>
      <Modal open={enabling} setOpen={setEnabling}>
        <h2 className="text-lg font-medium">Enable SMS</h2>
        <p className="text-sm text-neutral-400">
          We will ask for your phone number to confirm the integration.
        </p>
        <Form {...form}>
          <form
            className="w-full space-y-3"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    {...field}
                    disabled={smsSent}
                    placeholder="Phone Number"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {smsSent && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <Input {...field} placeholder="Code" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              disabled={!form.formState.isValid || (smsSent && !code)}
              loading={sendCode.isLoading || verifyCode.isLoading}
              className="w-full"
            >
              {smsSent ? "Validate Code" : "Send Code"}
            </Button>
          </form>
        </Form>
      </Modal>
      <IntegrationCard
        loading={status === "loading"}
        name="SMS"
        type="NOTIFICATION"
        description="Jumpcal will notify you about new calls via SMS."
        enabled={!!session?.user.phoneNumber}
        handleDisable={() => removeSms.mutate()}
        handleEnable={() => {
          setEnabling(true);
        }}
      />
    </>
  );
};

export default SmsNotification;
