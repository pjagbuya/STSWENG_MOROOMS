"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(data);

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/private");
}
