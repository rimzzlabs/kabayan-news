"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { withSonnerPromise } from "@/lib/sonner";
import { useSignIn } from "@/modules/auth/hooks";
import { type SignInSchema, signInSchema } from "@/modules/auth/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { O, pipe } from "@mobily/ts-belt";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export function SignInForm() {
  let router = useRouter();
  let [isPending, startTransition] = useTransition();
  let params = useSearchParams();

  let signIn = useSignIn();

  let form = useForm<SignInSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  let disableButton =
    form.formState.isSubmitting || signIn.isPending || isPending;
  let redirectPathname = pipe(
    params.get("from"),
    O.mapWithDefault(null, decodeURIComponent),
  );

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        let res = await signIn.mutateAsync(values);

        let isAdmin = res.role === "admin";
        if (isAdmin) {
          startTransition(() => {
            router.replace(redirectPathname || "/admin");
          });
          return;
        }

        startTransition(() => {
          router.replace(redirectPathname || "/");
        });
      },
      {
        loading: "Memverifikasi akun, harap tunggu beberapa saat..",
        error: "Email atau password salah",
        success: "Login berhasil",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Email</FormLabel>
                <FormControl>
                  <Input placeholder="Alamat email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputPassword placeholder="Kata sandi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter className="pt-5">
          <Button disabled={disableButton} className="ml-auto">
            Login
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
