import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./components/signin-form";

export default function SignIn() {
  return (
    <section className="h-[calc(100vh-4rem)] grid place-items-center">
      <Card className="w-11/12 mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Login ke aplikasi</CardTitle>
          <CardDescription>
            Silakan masuk ke akun Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>

        <SignInForm />
      </Card>
    </section>
  );
}
