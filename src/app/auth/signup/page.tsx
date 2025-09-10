import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "./components/signup-form";

export default function SignUp() {
  return (
    <section className="min-h-[calc(100vh-4rem)] grid place-items-center pt-6 pb-6">
      <Card className="w-11/12 mx-auto max-w-xl pb-2">
        <CardHeader>
          <CardTitle>Daftar ke aplikasi</CardTitle>
          <CardDescription>
            Daftarkan diri Anda ke Kabayan News untuk mengakses fitur-fitur
            didalam aplikasi Desa Kabayan
          </CardDescription>
        </CardHeader>

        <SignUpForm />

        <CardFooter className="justify-center border-t pt-2!">
          <p className="text-sm font-medium">
            Sudah punya akun?{" "}
            <ButtonLink
              variant="link"
              href="/auth/signin"
              className="px-0 h-auto underline"
            >
              Masuk
            </ButtonLink>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
