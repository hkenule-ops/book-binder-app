import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

function AdminHeader() {
  const { toggleSidebar, open } = useSidebar();
  const { theme } = useTheme();

  return (
    <header
      className="h-14 flex items-center border-b px-4 sticky top-0 z-10 backdrop-blur-md"
      style={{
        background: theme === 'dark'
          ? 'rgba(10, 30, 20, 0.6)'
          : 'rgba(255, 255, 255, 0.6)',
        borderBottomColor: theme === 'dark'
          ? 'rgba(15,110,86,0.25)'
          : 'rgba(15,110,86,0.15)',
      }}
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex w-full relative overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #061a12 0%, #0a2a1c 50%, #0d3322 100%)'
            : 'linear-gradient(135deg, #e8f5f0 0%, #f0faf6 50%, #e4f2eb 100%)',
        }}
      >
        {/* Blob 1 — green */}
        <div
          className="absolute top-10 left-1/4 w-96 h-96 rounded-full filter blur-3xl pointer-events-none animate-blob-fast"
          style={{
            background: '#0F6E56',
            opacity: isDark ? 0.35 : 0.45,
          }}
        />
        {/* Blob 2 — red */}
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-2000"
          style={{
            background: '#C0322A',
            opacity: isDark ? 0.28 : 0.35,
          }}
        />
        {/* Blob 3 — dark green */}
        <div
          className="absolute top-1/2 right-10 w-72 h-72 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-1000"
          style={{
            background: '#0a4a38',
            opacity: isDark ? 0.35 : 0.38,
          }}
        />

        <AppSidebar />

        <div className="flex-1 flex flex-col relative z-10">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        @keyframes blob-fast {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(40px, -60px) scale(1.15); }
          50%  { transform: translate(-30px, 30px) scale(0.85); }
          75%  { transform: translate(20px, -20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-fast {
          animation: blob-fast 4s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </SidebarProvider>
  );
}