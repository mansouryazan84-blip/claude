import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DirectionProvider } from '@/components/ui/direction';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import type { BreadcrumbEntry } from '@/components/layout/Breadcrumbs';

// ─── Lazy page imports ────────────────────────────────────
const Dashboard      = lazy(() => import('@/pages/Dashboard'));
const Inventory      = lazy(() => import('@/pages/Inventory'));
const Items          = lazy(() => import('@/pages/Items'));
const Transfers      = lazy(() => import('@/pages/Transfers'));
const Warehouses     = lazy(() => import('@/pages/Warehouses'));
const Suppliers      = lazy(() => import('@/pages/Suppliers'));
const Customers      = lazy(() => import('@/pages/Customers'));
const Purchases      = lazy(() => import('@/pages/Purchases'));
const Sales          = lazy(() => import('@/pages/Sales'));
const Employees      = lazy(() => import('@/pages/Employees'));
const Attendance     = lazy(() => import('@/pages/Attendance'));
const Fleet          = lazy(() => import('@/pages/Fleet'));
const Audit          = lazy(() => import('@/pages/Audit'));
const Reports        = lazy(() => import('@/pages/Reports'));
const NotFound       = lazy(() => import('@/pages/NotFound'));
const Login          = lazy(() => import('@/pages/auth/Login'));
const Register       = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

// ─── Form pages ───────────────────────────────────────────
const NewItem      = lazy(() => import('@/pages/items/NewItem'));
const NewTransfer  = lazy(() => import('@/pages/transfers/NewTransfer'));
const NewPurchase  = lazy(() => import('@/pages/purchases/NewPurchase'));
const NewSale      = lazy(() => import('@/pages/sales/NewSale'));
const NewContact   = lazy(() => import('@/pages/contacts/NewContact'));
const NewEmployee  = lazy(() => import('@/pages/employees/NewEmployee'));
const NewVehicle   = lazy(() => import('@/pages/fleet/NewVehicle'));
const NewWarehouse = lazy(() => import('@/pages/warehouses/NewWarehouse'));
const SettingsPage = lazy(() => import('@/pages/settings/Settings'));

// ─── QueryClient ──────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

// ─── Route config ─────────────────────────────────────────
interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => React.ReactElement>;
  breadcrumbs: BreadcrumbEntry[];
}

const CRUMB_HOME: BreadcrumbEntry = { title: 'لوحة التحكم', href: '/' };

const routes: RouteConfig[] = [
  { path: '/',           element: Dashboard,  breadcrumbs: [{ title: 'لوحة التحكم' }] },
  { path: '/inventory',  element: Inventory,  breadcrumbs: [CRUMB_HOME, { title: 'المخزون' }] },
  { path: '/items',      element: Items,      breadcrumbs: [CRUMB_HOME, { title: 'الأصناف' }] },
  { path: '/transfers',  element: Transfers,  breadcrumbs: [CRUMB_HOME, { title: 'المناقلات' }] },
  { path: '/warehouses', element: Warehouses, breadcrumbs: [CRUMB_HOME, { title: 'المستودعات' }] },
  { path: '/suppliers',  element: Suppliers,  breadcrumbs: [CRUMB_HOME, { title: 'الموردون' }] },
  { path: '/customers',  element: Customers,  breadcrumbs: [CRUMB_HOME, { title: 'العملاء' }] },
  { path: '/purchases',  element: Purchases,  breadcrumbs: [CRUMB_HOME, { title: 'المشتريات' }] },
  { path: '/sales',      element: Sales,      breadcrumbs: [CRUMB_HOME, { title: 'المبيعات' }] },
  { path: '/employees',  element: Employees,  breadcrumbs: [CRUMB_HOME, { title: 'الموظفون' }] },
  { path: '/attendance', element: Attendance, breadcrumbs: [CRUMB_HOME, { title: 'الحضور والانصراف' }] },
  { path: '/fleet',      element: Fleet,      breadcrumbs: [CRUMB_HOME, { title: 'الأسطول' }] },
  { path: '/audit',      element: Audit,      breadcrumbs: [CRUMB_HOME, { title: 'سجل التدقيق' }] },
  { path: '/reports',    element: Reports,    breadcrumbs: [CRUMB_HOME, { title: 'التقارير' }] },
  { path: '/settings',   element: SettingsPage, breadcrumbs: [CRUMB_HOME, { title: 'الإعدادات' }] },
  // ── New / form pages ────────────────────────────────────
  { path: '/items/new',      element: NewItem,      breadcrumbs: [CRUMB_HOME, { title: 'الأصناف', href: '/items' },      { title: 'إضافة صنف' }] },
  { path: '/transfers/new',  element: NewTransfer,  breadcrumbs: [CRUMB_HOME, { title: 'المناقلات', href: '/transfers' }, { title: 'طلب مناقلة جديد' }] },
  { path: '/purchases/new',  element: NewPurchase,  breadcrumbs: [CRUMB_HOME, { title: 'المشتريات', href: '/purchases' }, { title: 'أمر شراء جديد' }] },
  { path: '/sales/new',      element: NewSale,      breadcrumbs: [CRUMB_HOME, { title: 'المبيعات', href: '/sales' },      { title: 'أمر بيع جديد' }] },
  { path: '/employees/new',  element: NewEmployee,  breadcrumbs: [CRUMB_HOME, { title: 'الموظفون', href: '/employees' },  { title: 'إضافة موظف' }] },
  { path: '/fleet/new',      element: NewVehicle,   breadcrumbs: [CRUMB_HOME, { title: 'الأسطول', href: '/fleet' },       { title: 'إضافة مركبة' }] },
  { path: '/warehouses/new', element: NewWarehouse, breadcrumbs: [CRUMB_HOME, { title: 'المستودعات', href: '/warehouses' },{ title: 'إضافة مستودع' }] },
];

// ─── Guards ───────────────────────────────────────────────
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

// ─── Suspense wrapper ─────────────────────────────────────
function PageLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function wrap(
  Page: React.LazyExoticComponent<() => React.ReactElement>,
  breadcrumbs: BreadcrumbEntry[],
) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageLoader>
        <Page />
      </PageLoader>
    </AppLayout>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  return (
    <DirectionProvider dir="rtl">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ── Guest ───────────────────────────────── */}
                <Route element={<GuestRoute />}>
                  <Route path="/login"           element={<PageLoader><Login /></PageLoader>} />
                  <Route path="/register"        element={<PageLoader><Register /></PageLoader>} />
                  <Route path="/forgot-password" element={<PageLoader><ForgotPassword /></PageLoader>} />
                </Route>

                {/* ── Protected ───────────────────────────── */}
                <Route element={<ProtectedRoute />}>
                  {routes.map(({ path, element: Page, breadcrumbs }) => (
                    <Route key={path} path={path} element={wrap(Page, breadcrumbs)} />
                  ))}

                  {/* Supplier new — shared component with type="supplier" */}
                  <Route
                    path="/suppliers/new"
                    element={
                      <AppLayout breadcrumbs={[CRUMB_HOME, { title: 'الموردون', href: '/suppliers' }, { title: 'إضافة مورد' }]}>
                        <PageLoader><NewContact type="supplier" /></PageLoader>
                      </AppLayout>
                    }
                  />

                  {/* Customer new — shared component with type="customer" */}
                  <Route
                    path="/customers/new"
                    element={
                      <AppLayout breadcrumbs={[CRUMB_HOME, { title: 'العملاء', href: '/customers' }, { title: 'إضافة عميل' }]}>
                        <PageLoader><NewContact type="customer" /></PageLoader>
                      </AppLayout>
                    }
                  />
                </Route>

                {/* ── 404 ─────────────────────────────────── */}
                <Route path="*" element={<PageLoader><NotFound /></PageLoader>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </DirectionProvider>
  );
}
