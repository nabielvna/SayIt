"use client";

import { useHeader } from "@/components/header-context";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const { headerContent } = useHeader();

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {headerContent ?? <h1 className="text-base font-medium">{siteConfig.appName}</h1>}
      </div>
    </header>
  );
}
