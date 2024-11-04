import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
