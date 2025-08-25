"use server";
import { cookies } from "next/headers";
import { COOKIE_TOKEN, COOKIE_USER } from "@/constants";
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
