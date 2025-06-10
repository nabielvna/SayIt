"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  IconHome,
  IconMessageCircle,
  IconRobot,
  IconUserHeart,
  IconNotebook,
  IconDatabase,
  IconLoader2,
  IconInnerShadowTop,
} from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";

// Impor store yang baru kita buat
import { useTokenStore } from "@/stores/use-token-store";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";


interface TokenDisplayProps {
  tokenBalance: number | null | undefined;
  isLoading: boolean;
}

const TokenDisplay = ({ tokenBalance, isLoading }: TokenDisplayProps) => {
  // ... (kode TokenDisplay tidak perlu diubah, tetap sama)
  return (
    <div className="px-3 pt-6 mt-auto">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex h-8 w-full items-center gap-x-3 rounded-md px-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {isLoading ? (
              <>
                <IconLoader2 className="size-5 animate-spin text-zinc-500" />
                <span className="text-zinc-500">...</span>
              </>
            ) : (
              <>
                <IconDatabase className="size-5 flex-shrink-0 text-sky-500" />
                <span className="flex-grow">Token</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold dark:bg-zinc-700">
                  {(tokenBalance ?? 0).toLocaleString("id-ID")}
                </span>
              </>
            )}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};


const navMainItems = [
  { title: "Home", url: "/dashboard", icon: IconHome },
  { title: "Anonymous Chat", url: "/anonymous", icon: IconMessageCircle },
  { title: "Sayit AI Chat", url: "/sayit", icon: IconRobot },
  { title: "Talk to a Professional", url: "/professional", icon: IconUserHeart },
  { title: "My Notes", url: "/notes", icon: IconNotebook },
];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Hapus useState lokal, ganti dengan state dari store Zustand
  const { tokenBalance, isLoading, fetchTokenBalance } = useTokenStore();
  
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Jika pengguna sudah login, panggil aksi fetchTokenBalance dari store
    if (isLoaded && isSignedIn) {
      fetchTokenBalance(getToken);
    }
  }, [isSignedIn, isLoaded, fetchTokenBalance, getToken]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{siteConfig.appName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} />

        {/* Kirim props dari store, bukan dari state lokal lagi */}
        {isSignedIn && (
          <TokenDisplay
            isLoading={isLoading}
            tokenBalance={tokenBalance}
          />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}