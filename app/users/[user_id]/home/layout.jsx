import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div>
      <Header />
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
