"use server";
import { cookies } from "next/headers";
import { COOKIE_TOKEN, COOKIE_USER } from "@/constants";
import { generateJwtToken } from "@/lib/serverUtils";
import { createClient } from "@/lib/supabase/server";
const users = [
  {
    name: "Admin",
    username: "admin@1.com",
    pass: "pass",
    token: "1234567890",
  },
];
export const login = async (username: string, pass: string) => {
  const user = users.find((u) => u.username === username && u.pass === pass);
  if (!user) {
    return {
      success: false,
      message: "Invalid username or password",
    };
  }
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_USER, user?.username || "");
  cookieStore.set(COOKIE_TOKEN, user?.token || "");
  return {
    success: true,
    message: "Login successful",
    user: user,
  };
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_USER);
  cookieStore.delete(COOKIE_TOKEN);
  return {
    success: true,
    message: "Logout successful",
  };
};
export const loginWithWallet = async (address: string) => {
  // const isValidAddress = await validateAddress(address);
  const token = generateJwtToken(address);
  const supabase = await createClient();
  const { data: userData, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", address);

  if (!userData) {
    // write the new user in teh table
    const { data, error } = await supabase.from("users").insert({
      wallet_address: address,
      name: address,
      last_logged_in: new Date().toISOString(),
    });
    if (error) {
      console.log(error);
    }
  }
  console.log(userData);
  const { data, error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token,
  });
  console.log(data, error);
  // auth.setSession({
  //   access_token: token,
  //   refresh_token: token,
  // });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, address || "");
};

export const getUser = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get(COOKIE_USER);
  return user;
};