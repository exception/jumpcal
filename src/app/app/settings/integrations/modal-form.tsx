"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/providers/trpc-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const calOrCalendlyLinkRegex =
  /^(https:\/\/)?(www\.)?(cal\.com|calendly\.com)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;

const formSchema = z.object({
  embedLink: z.string().refine((t) => calOrCalendlyLinkRegex.test(t), {
    message: "Please provide a valid Cal.com or Calendly.com link",
  }),
});

interface Props {
  close: () => void;
}

const ScheduleModalForm = ({ close }: Props) => {
  const { update } = useSession();
  const { toast } = useToast();

  const updateCalendarLink = trpc.users.update.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "Successfully added Calendar link!",
      });
      close();
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const embedLink = form.watch("embedLink");

  const getEmbedType = () => {
    if (embedLink.includes("cal.com")) return "Cal.com";
    if (embedLink.includes("calendly.com")) return "Calendly";

    return "";
  };

  const handleSubmit = (form: z.infer<typeof formSchema>) => {
    updateCalendarLink.mutate({
      calendarLink: form.embedLink,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="embedLink"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://cal.com/erosemberg/30min"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          icon={<Plus className="h-4 w-4" />}
          className="w-full"
          disabled={!form.formState.isValid}
          loading={updateCalendarLink.isLoading}
        >
          {form.formState.isValid ? `Add ${getEmbedType()} Link` : "Add Link"}
        </Button>
      </form>
    </Form>
  );
};

export default ScheduleModalForm;
