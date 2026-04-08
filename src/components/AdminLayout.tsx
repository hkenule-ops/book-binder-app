import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminHeader() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header
      className="h-14 flex items-center border-b px-4"
      style={{ borderBottomColor: 'rgba(15,110,86,0.2)' }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        style={{ color: '#0F6E56' }}
      >
        {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </Button>
    </header>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}