import { FolderOpen, Users, Upload, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import logo from '@/images/mrsoft logo.svg';

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Courses', url: '/admin/categories', icon: FolderOpen },
  { title: 'Students', url: '/admin/students', icon: Users },
  { title: 'Books', url: '/admin/books', icon: Upload },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar
      collapsible="icon"
      style={{
        background: 'linear-gradient(180deg, #0a4a38 0%, #0F6E56 100%)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <SidebarContent>
        <SidebarGroup>
          {/* Logo area */}
          <div className="flex items-center justify-center py-4 mb-2 border-b border-white/10">
            {collapsed ? (
              <img
                src={logo}
                alt="Logo"
                className="w-8 h-8 object-contain bg-white/95 rounded-md p-1"
              />
            ) : (
              <div className="bg-white/95 rounded-xl px-4 py-2 shadow-md">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-9 w-auto object-contain block"
                />
              </div>
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      activeClassName="bg-white/20 text-white font-medium border-l-2 border-[#C0322A]"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-white/10 pt-1 pb-2 px-2 space-y-1">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={toggleTheme}
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4 shrink-0" />
              : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && (
              <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/70 hover:text-white hover:bg-[#C0322A]/80"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>

          {/* User email */}
          {!collapsed && user && (
            <p className="text-xs text-white/40 px-2 pt-1 truncate">{user.email}</p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}