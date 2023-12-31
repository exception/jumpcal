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
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/providers/trpc-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(1).max(60),
  description: z.string().max(200),
});

const AccountSettingsForm = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const updateUser = trpc.users.update.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "Account settings saved",
        description: "We have successfully saved your account settings.",
      });
    },
    onError() {
      toast({
        title: "Account settings failed to save",
        description: "Something went wrong while saving your account settings.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: session?.user.name ?? "",
      description: session?.user.description ?? "",
    },
  });

  const handleSubmit = (form: z.infer<typeof formSchema>) => {
    updateUser.mutate(form);
  };

  useEffect(() => {
    if (!form.getValues().fullName && session?.user.name) {
      form.setValue("fullName", session.user.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.name]);

  return (
    <Form {...form}>
      <form
        className="space-y-2 flex flex-col"
        onSubmit={form.handleSubmit(handleSubmit)}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="A brief description about who you are and how you can help potential callers."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isDirty || !form.formState.isValid}
          size="sm"
          className="self-end"
          icon={<SaveIcon className="w-4 h-4" />}
          loading={updateUser.isLoading}
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default AccountSettingsForm;
