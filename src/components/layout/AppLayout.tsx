import { type ReactNode, useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Breadcrumbs, type BreadcrumbEntry } from './Breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbEntry[];
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('wms_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('wms_theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <SidebarProvider>
      <div className="pl-2 flex min-h-screen w-full" dir="rtl">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 rounded-lg">
            <SidebarTrigger className="-mr-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-4" />
            {breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
            <div className="flex items-center gap-1 mr-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setDark((d) => !d)}
                title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
                title="الإشعارات"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
