import { AppSidebar } from "@/components/voter/app-sidebar";
import { SiteHeader } from "@/components/voter/site-header";
import { SidebarController } from "@/components/voter/sidebar-controller";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function VoterLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider
        defaultOpen={true}
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <SidebarController>
          <AppSidebar variant="inset" />
          <SidebarInset className="overflow-hidden">
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
          <Toaster richColors />
        </SidebarController>
      </SidebarProvider>
    </ThemeProvider>
  );
}