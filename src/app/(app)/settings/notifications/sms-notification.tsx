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

const formSchema = z.object({
  phoneNumber: z.string().min(1),
  code: z.string().max(6).optional(),
});

const SmsNotification = () => {
  const { data: session, update, status } = useSession();
  const [enabling, setEnabling] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const code = form.watch("code");

  useEffect(() => {
    if (smsSent) {
      form.register("code");
    }
  }, [smsSent]);

  const handleSubmit = (form: z.infer<typeof formSchema>) => {
    if (!smsSent) {
      setSmsSent(true);
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
                  <Input {...field} placeholder="Phone Number" />
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
        handleDisable={async () => void 0}
        handleEnable={async () => {
          setEnabling(true);
        }}
      />
    </>
  );
};

export default SmsNotification;
