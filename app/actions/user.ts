"use server";
import { cookies } from "next/headers";
import { COOKIE_TOKEN, COOKIE_USER } from "@/constants";
import { generateJwtToken } from "@/lib/serverUtils";
import { createClient } from "@/lib/supabase/server";
import { User } from "@privy-io/react-auth";
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
export const loginWithWallet = async (
  { id, ...privyUser }: User,
  token: string
) => {
  // const isValidAddress = await validateAddress(address);
  // const token = generateJwtToken(address);
  console.log("loginWithWallet", privyUser);
  const supabase = await createClient();
  const { data: userData, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("user_privy_id", id);

  if (userData?.length === 0) {
    console.log("writing new user in the table", id, privyUser);
    // write the new user in teh table
    const { data, error } = await supabase.from("users").insert({
      user_privy_id: id,
      privy_created_at: privyUser?.createdAt?.toISOString(),
      linked_accounts: privyUser.linkedAccounts,
      metadata: privyUser,
      is_guest: privyUser.isGuest,
      has_accepted_terms: privyUser.hasAcceptedTerms,
      last_logged_in: new Date().toISOString(),
    });

    console.log("data after writing to ssupabase", data);
    if (error) {
      console.log(error);
    }
  } else {
    const { data, error } = await supabase
      .from("users")
      .update({ last_logged_in: new Date().toISOString() })
      .eq("user_privy_id", id);
    if (error) {
      console.log(error);
    }
  }
  console.log(userData);
  // const { data, error } = await supabase.auth.setSession({
  //   access_token: token,
  //   refresh_token: token,
  // });
  // console.log(data, error);
  // auth.setSession({
  //   access_token: token,
  //   refresh_token: token,
  // });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_TOKEN, token || "");
};

export const getUser = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get(COOKIE_USER);
  return user;
};