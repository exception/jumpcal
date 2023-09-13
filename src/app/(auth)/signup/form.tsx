"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import GoogleIcon from "@/components/ui/icons/google-icon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1).max(16),
});

const LoginForm = () => {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const username = form.watch("username");

  useEffect(() => {
    const error = searchParams?.get("error");
    error &&
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const callbackUrl = useMemo(() => {
    if (username) {
      return { callbackUrl: `/getting-started?username=${username}` };
    } else if (next && next.length > 0) {
      return { callbackUrl: next };
    } else {
      return {};
    }
  }, [username, next]);

  return (
    <div className="space-y-4 w-full">
      <Form {...form}>
        <form className="w-full text-left">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Input {...field} placeholder="username" addOn="jumpcal.com/" />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Separator />
      <Button
        loading={clickedGoogle}
        disabled={!form.formState.isValid}
        size="xl"
        onClick={() => {
          setClickedGoogle(true);
          void signIn("google", {
            ...callbackUrl,
          });
        }}
        icon={<GoogleIcon className="h-4 w-4" />}
      >
        Continue with Google
      </Button>
      <p className="text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/signin">
          <strong>Sign in.</strong>
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
