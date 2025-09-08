"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { onChangeNumericOnly } from "@/lib/event";
import { withSonnerPromise } from "@/lib/sonner";
import { useSignUp } from "@/modules/auth/hooks";
import { signUpSchema, type SignUpSchema } from "@/modules/auth/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export function SignUpForm() {
  let router = useRouter();
  let [isPending, startTransition] = useTransition();

  let signUp = useSignUp();

  let form = useForm<SignUpSchema>({
    defaultValues: { email: "", password: "", address: "", name: "", nik: "" },
    resolver: zodResolver(signUpSchema),
  });

  let disableButton =
    form.formState.isSubmitting || signUp.isPending || isPending;

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await signUp.mutateAsync(values);

        startTransition(() => {
          router.replace("/auth/signin");
        });
      },
      {
        loading: "Memverifikasi akun, harap tunggu beberapa saat..",
        error: "Gagal membuat akun, harap coba lagi nanti",
        success: "Harap cek email anda untuk verifikasi akun baru Anda",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-5">
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK (16 angka)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan NIK Anda"
                      {...field}
                      onChange={onChangeNumericOnly(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Alamat email" {...field} />
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
                <FormDescription className="text-balance">
                  Password harus memiliki minimal 6 karakter, mengandung huruf
                  kecil, huruf besar, angka, dan simbol.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat lengkap</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Alamat lengkap anda"
                    className="max-h-40 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter className="pt-5">
          <Button disabled={disableButton} className="ml-auto">
            Daftar
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
