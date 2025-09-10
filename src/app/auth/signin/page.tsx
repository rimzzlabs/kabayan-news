import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./components/signin-form";
import { ButtonLink } from "@/components/ui/button";

export default function SignIn() {
  return (
    <section className="h-[calc(100vh-4rem)] grid place-items-center">
      <Card className="w-11/12 mx-auto max-w-md pb-2">
        <CardHeader>
          <CardTitle>Login ke aplikasi</CardTitle>
          <CardDescription>
            Silakan masuk ke akun Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>

        <SignInForm />

        <CardFooter className="justify-center border-t pt-2!">
          <p className="text-sm font-medium">
            Belum punya akun?{" "}
            <ButtonLink
              variant="link"
              href="/auth/signup"
              className="px-0 h-auto underline"
            >
              Daftar
            </ButtonLink>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
