import React from "react";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_USER } from "@/constants";
import {
  SIDEBAR_COOKIE_NAME,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const user = cookieStore.get(COOKIE_USER);
  // const defaultOpen = cookieStore?.get(SIDEBAR_COOKIE_NAME)?.value === "true";
  console.log(user);
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

          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <Footer />
          </footer>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
