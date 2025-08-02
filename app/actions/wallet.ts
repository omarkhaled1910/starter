"use server";

import { createClient } from "@/lib/supabase/server";

export async function findOrCreateUser(walletAddress: string) {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();

  if (error && error.code !== "PGRST116") {
    return { success: false, message: error.message };
  }

  if (user) {
    return { success: true, user };
  }

  const { data: newUser, error: createError } = await supabase
    .from("users")
    .insert([{ wallet_address: walletAddress }])
    .select()
    .single();

  if (createError) {
    return { success: false, message: createError.message };
  }

  return { success: true, user: newUser };
}
