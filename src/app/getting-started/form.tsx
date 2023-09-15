"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/providers/trpc-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(1).max(16),
  fullName: z.string().min(1).max(60),
  timezone: z.string(),
});

const OnboardingForm = () => {
  const searchParams = useSearchParams();
  const username = searchParams?.get("username");
  const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: session?.user?.name ?? "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      username: username ?? "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!form.getValues().fullName && session?.user.name) {
      form.setValue("fullName", session.user.name);
      // TODO add slugified full name as username
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.name]);

  const onboardUserMutation = trpc.users.onboard.useMutation({
    async onSuccess() {
      await update();
      router.push("/");
      toast({
        title: "Redirecting...",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
      console.error(error);
    },
  });

  const submitHandler = (form: z.infer<typeof formSchema>) => {
    void onboardUserMutation.mutate(form);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <Input {...field} placeholder="Full Name" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input {...field} placeholder="username" addOn="jumpcal.com/" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-96 overflow-y-scroll">
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
          icon={<ArrowRight className="h-4 w-4" />}
          className="w-full"
          disabled={!form.formState.isValid}
          loading={onboardUserMutation.isLoading}
        >
          Finish
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
