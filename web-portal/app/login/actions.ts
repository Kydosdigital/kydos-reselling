"use server";

import { redirect } from "next/navigation";
import { getAuth, isNeonAuthConfigured } from "@/lib/auth/server";

export async function login(formData: FormData) {
  if (!isNeonAuthConfigured()) {
    redirect("/login?setup=pending");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await getAuth().signIn.email({ email, password });

  if (error) {
    redirect("/login?error=1");
  }

  redirect("/portal");
}

export async function signOut() {
  if (isNeonAuthConfigured()) {
    await getAuth().signOut();
  }
  redirect("/");
}
