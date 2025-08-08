"use client";
import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/user";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ui/mode-toggle";
import Link from "next/link";
import { COOKIE_TOKEN, COOKIE_USER } from "@/constants";
import { SidebarTrigger } from "../ui/sidebar";
import { useAccount, useAccountEffect } from "wagmi";
import ConnectButton from "../custom/ConnectButton";
const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { resetUser, user } = useUserStore();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(COOKIE_USER);
    localStorage.removeItem(COOKIE_TOKEN);
    resetUser();
    router.push("/login");
  };
  const { address } = useAccount();

  useAccountEffect({
    async onConnect(data) {
      console.log("Connected!", data);
    },
    async onDisconnect() {
      console.log("Disconnected!");
      await handleLogout();
      router.push("/login");
    },
  });

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all shadow-sm duration-300 ${
        isScrolled
          ? "bg-secondary/20 backdrop-blur-md shadow-md py-2 border-b"
          : " py-4 bg-secondary"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">
          <SidebarTrigger />

          <Link href="/pet-dashboard">Pet Store</Link>
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink className="grid gap-3 p-4 w-[200px]">
                  <div className="font-medium">Feature 1</div>
                  <p className="text-sm text-muted-foreground">
                    Description of feature
                  </p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>Solutions </NavigationMenuItem>
            <NavigationMenuItem>Resources </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Avatar with Dropdown */}
        <div className="flex flex-row items-center justify-center gap-2">
          <ModeToggle />
          {/* <ConnectButton /> */}
          {true ? (
            <ConnectButton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="border-2 border-white">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
