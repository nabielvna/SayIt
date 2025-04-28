import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HeaderProvider } from "@/components/header-context";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  // Server-side authentication check
  const user = await currentUser();
  
  // If no user is found, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // If authenticated, show the layout
  return (
    <SidebarProvider
      className="h-screen overflow-hidden"
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      
      <SidebarInset className="flex flex-col h-full md:h-[98%] overflow-hidden">
        <HeaderProvider>
          <SiteHeader />
          
          {/* Wrapping the children in a scrollable container */}
          <div className="overflow-auto">
            {children}
          </div>
        </HeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}