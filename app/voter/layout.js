import { AppSidebar } from "@/components/voter/app-sidebar";
import { SiteHeader } from "@/components/voter/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-provider";

export default function VoterLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sipilih-theme">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
        <Toaster richColors/>
      </SidebarProvider>
    </ThemeProvider>
  );
}