import React from "react";
import AuthHeader from "@/components/layout/AuthHeader";
import Footer from "@/components/layout/Footer";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      {children}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
};

export default AuthLayout;
