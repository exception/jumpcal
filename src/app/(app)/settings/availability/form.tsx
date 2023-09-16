"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { trpc } from "@/lib/providers/trpc-provider";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import AvailabilityTable from "./availability-table";

const formSchema = z.object({
  timezone: z.string(),
});

const AvailabilityContent = () => {
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timezone:
        session?.user.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const saveTimezone = trpc.users.update.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "Timezone changed",
        description: "You have successfully changed your timezone!",
      });
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    saveTimezone.mutate({
      timezone: values.timezone,
    });
  };

  return (
    <div>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Timezone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-48 md:max-h-96 overflow-y-scroll">
                    {Intl.supportedValuesOf("timeZone").map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isDirty || !form.formState.isValid}
            className="mt-2"
            icon={<SaveIcon className="w-4 h-4" />}
            loading={saveTimezone.isLoading}
          >
            Save
          </Button>
        </form>
      </Form>
      <AvailabilityTable />
    </div>
  );
};

export default AvailabilityContent;
