import React from "react";
import AuthHeader from "@/components/layout/AuthHeader";
import Footer from "@/components/layout/Footer";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />
      {children}
      <Footer />
    </div>
  );
};

export default AuthLayout;
