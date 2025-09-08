"use server";

import { failedAction, successAction } from "@/lib/action";
import type { SignInSchema, SignUpSchema } from "@/modules/auth/zod-schema";
import { createClient } from "@/modules/supabase/server";
import { revalidatePath } from "next/cache";

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function signinAction(payload: SignInSchema) {
  let supabase = await createClient();

  let signIn = await supabase.auth.signInWithPassword(payload);

  if (signIn.error) return failedAction(signIn.error.message);

  let userId = signIn.data.user.id;

  let userQuery = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (userQuery.error) return failedAction(userQuery.error.message);
  if (!userQuery.data) return failedAction("Role not found");

  let role = userQuery.data.role;

  if (role === "admin") {
    revalidatePath("/admin");
  } else if (role === "user") {
    revalidatePath("/");
  }

  return successAction({ role, message: "Berhasil Masuk" });
}

export async function signupAction(payload: SignUpSchema) {
  if (!siteUrl) throw new Error("Missing siteURL");

  let supabase = await createClient();

  let signUpQuery = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (signUpQuery.error) {
    console.info("signup error: ", signUpQuery.error);
    return failedAction("User dengan email ini sudah terdaftar");
  }

  if (!signUpQuery.data.user) {
    console.info("signup user error: ", signUpQuery.error);
    return failedAction("Gagal membuat akun");
  }

  let profileQuery = await supabase.from("profiles").insert({
    nama: payload.name,
    alamat: payload.address,
    id: signUpQuery.data.user.id,
    nik: payload.nik,
    status_aktif: true,
    role: "warga",
  });

  if (profileQuery.error) {
    console.info("profile error: ", profileQuery.error);
    return failedAction(profileQuery.error.message);
  }

  return successAction({ message: "Berhasil membuat akun" });
}

export async function signOutAction() {
  let client = await createClient();

  let res = await client.auth.signOut();
  if (res.error) return failedAction(res.error.message);

  return successAction({ message: "Berhasil logout" });
}
