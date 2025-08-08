"use client";
import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { login, loginWithWallet } from "@/app/actions/user";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/user";
import { COOKIE_TOKEN, COOKIE_USER } from "@/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount, useAccountEffect } from "wagmi";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { address } = useAccount();
  console.log(address, "address");
  const form = useForm({
    defaultValues: {
      email: "admin@1.com",
      password: "pass",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await login(value.email, value.password);
      if (res.success && res.user) {
        toast.success("Login successful");
        setUser(res.user);
        if (typeof window !== "undefined") {
          localStorage.setItem(COOKIE_USER, JSON.stringify(res.user));
        }
        router.push("/pet-dashboard");
        return;
      }
      toast.error(res.message);
    },
  });

  useEffect(() => {
    if (address) {
      loginWithWallet(address);
      // document.cookie = `${COOKIE_TOKEN}=${address}; path=/; max-age=${19999999999}`;
    }
  }, [address]);

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);
      if (address) {
        loginWithWallet(address);
        router.push("/");
      }
    },
  });

  const emailField = {
    name: "email",
    label: "Email Address",
    type: "email" as const,
    placeholder: "Enter your email",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Email is required"
          : !value.includes("@")
          ? "Please enter a valid email address"
          : undefined,
    },
  };

  const passwordField = {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Enter your password",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Password is required"
          : value.length < 4
          ? "Password must be at least 4 characters"
          : undefined,
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-10 w-auto"
          />
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Sign in to your account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-accent">
                <TabsTrigger
                  value="email"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Email Login
                </TabsTrigger>
                <TabsTrigger
                  value="crypto"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Crypto Login
                </TabsTrigger>
              </TabsList>

              {/* Email Login Tab */}
              <TabsContent value="email" className="pt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  <div>
                    <FormField fieldConfig={emailField} form={form} />
                  </div>

                  <div>
                    <FormField fieldConfig={passwordField} form={form} />
                  </div>

                  <div className="flex justify-center w-full">
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          type="submit"
                          disabled={!canSubmit}
                        >
                          {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                      )}
                    />
                  </div>
                </form>

                <div className="mt-4 text-center">
                  <Link
                    href="/register"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
              </TabsContent>

              {/* Crypto Login Tab */}
              <TabsContent value="crypto" className="pt-6">
                <div className="space-y-6">
                  <div className="text-center text-card-foreground">
                    <p className="mb-4">Connect your wallet to sign in</p>
                    <div className="flex justify-center">
                      <ConnectButton
                        showBalance={false}
                        accountStatus="address"
                        chainStatus="icon"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground text-center pt-4 border-t border-border">
                    <p>Don't have a crypto wallet yet?</p>
                    <Link
                      href="#"
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      Learn how to get started
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;