import {
  Calendar,
  Coins,
  Home,
  Inbox,
  Search,
  Settings,
  Wallet2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "NFT Dashboard",
    url: "/nft-dashboard",
    icon: Home,
  },
  {
    title: "Tokens",
    url: "/tokens",
    icon: Coins,
  },
  {
    title: "NFT Marketplace",
    url: "/nft-marketplace",
    icon: Inbox,
  },
  {
    title: "NFT Details",
    url: "/nft-details",
    icon: Calendar,
  },
  {
    title: "Liked NFTs",
    url: "/liked-nfts",
    icon: Search,
  },

  {
    title: "NFT Generator",
    url: "/nft-generator",
    icon: Settings,
  },
  {
    title: "Deployer",
    url: "/deployer",
    icon: Wallet2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
