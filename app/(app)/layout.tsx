import React from "react";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_TOKEN } from "@/constants";
import {
  SIDEBAR_COOKIE_NAME,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const user = cookieStore.get(COOKIE_TOKEN);
  // const defaultOpen = cookieStore?.get(SIDEBAR_COOKIE_NAME)?.value === "true";
  console.log(user, "user");
  if (!user) {
    redirect("/login");
  }
  return (
    <SidebarProvider className="sidebar" defaultOpen={true}>
      <AppSidebar />

      <main className=" flex-1">
        <Header />
        <div className="min-h-screen  container mx-auto py-4">
          {children}

          <Footer />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
