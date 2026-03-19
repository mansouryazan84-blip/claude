import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { NavUser } from './NavUser';
import { mainNavItem, navGroups, footerNavItems } from '@/lib/navigation';
import { Warehouse, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

function NavLink({ href, icon: Icon, title }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string }) {
  const { pathname } = useLocation();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={title}>
        <Link to={href}>
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar side="right" collapsible="icon" variant="inset">
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border/50 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Warehouse className="h-4 w-4 text-sidebar-foreground" />
                </div>
                <div className="grid text-right">
                  <span className="font-bold text-sm text-sidebar-foreground leading-none">WMS</span>
                  <span className="text-[10px] text-sidebar-foreground/50 mt-0.5">إدارة المستودعات</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLink
                href={mainNavItem.href}
                icon={mainNavItem.icon}
                title={mainNavItem.title}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Module Groups */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border/50 pt-3">
        <SidebarMenu>
          {footerNavItems.map((item) => (
            <NavLink key={item.href} href={item.href} icon={item.icon} title={item.title} />
          ))}
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
