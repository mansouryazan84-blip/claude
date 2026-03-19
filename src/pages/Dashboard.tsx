import {
  Package, AlertTriangle, TrendingUp, Truck,
  ArrowLeftRight, Users, Clock, Warehouse,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  mockDashboardStats,
  mockSalesChartData,
  mockCategoryChartData,
  mockTransfers,
} from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import type { MovementStatus } from '@/types';

const CHART_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899',
];

const statusLabels: Record<MovementStatus, string> = {
  pending: 'بانتظار الموافقة',
  approved: 'معتمد',
  in_transit: 'قيد النقل',
  completed: 'تم التسليم',
  cancelled: 'ملغي',
};

const statusVariantMap: Record<MovementStatus, 'pending' | 'info' | 'in_transit' | 'completed' | 'cancelled'> = {
  pending: 'pending',
  approved: 'info',
  in_transit: 'in_transit',
  completed: 'completed',
  cancelled: 'cancelled',
};

const recentTransfers = mockTransfers.slice(0, 4);

export default function Dashboard() {
  const s = mockDashboardStats;

  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على العمليات والمؤشرات الرئيسية"
      />

      {/* KPI Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الأصناف"
          value={s.totalItems.toLocaleString('ar-SA')}
          icon={Package}
          trend={{ value: '+12 هذا الشهر', direction: 'up' }}
          tone="default"
        />
        <StatCard
          title="مخزون حرج"
          value={s.criticalStock}
          icon={AlertTriangle}
          trend={{ value: 'أصناف دون الحد الأدنى', direction: 'flat' }}
          tone="danger"
        />
        <StatCard
          title="قريبة الانتهاء"
          value={s.nearExpiry}
          icon={Clock}
          trend={{ value: 'خلال 30 يوم', direction: 'flat' }}
          tone="warning"
        />
        <StatCard
          title="مناقلات معلقة"
          value={s.pendingTransfers}
          icon={ArrowLeftRight}
          trend={{ value: 'تحتاج موافقة', direction: 'flat' }}
          tone="info"
        />
        <StatCard
          title="مبيعات اليوم"
          value={formatCurrency(s.todaySales)}
          icon={TrendingUp}
          trend={{ value: '+18% مقارنة بالأمس', direction: 'up' }}
          tone="success"
        />
        <StatCard
          title="مشتريات اليوم"
          value={formatCurrency(s.todayPurchases)}
          icon={Package}
          trend={{ value: 'فواتير واردة', direction: 'flat' }}
          tone="default"
        />
        <StatCard
          title="الموظفون الحاضرون"
          value={`${s.presentEmployees}/${s.totalEmployees}`}
          icon={Users}
          trend={{ value: `${s.totalEmployees - s.presentEmployees} غائب`, direction: 'flat' }}
          tone="default"
        />
        <StatCard
          title="المستودعات النشطة"
          value={s.activeWarehouses}
          icon={Warehouse}
          trend={{ value: 'جميعها تعمل', direction: 'flat' }}
          tone="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              المبيعات والمشتريات — الأسبوع الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockSalesChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                    direction: 'rtl',
                  }}
                  formatter={(v: number) => [formatCurrency(v), '']}
                />
                <Bar dataKey="sales" name="مبيعات" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchases" name="مشتريات" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                مبيعات
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                مشتريات
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              توزيع المخزون حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockCategoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {mockCategoryChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {mockCategoryChartData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-muted-foreground truncate">{cat.name}</span>
                  <span className="font-semibold text-foreground mr-auto">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transfers */}
      <Card className="glass-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Truck className="h-4 w-4" />
            آخر المناقلات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['رقم المرجع', 'من', 'إلى', 'الصنف', 'الكمية', 'السائق', 'الحالة'].map((h) => (
                    <th key={h} className="text-right py-2.5 px-4 text-xs text-muted-foreground font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransfers.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-medium text-foreground">{t.referenceNo}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{t.fromWarehouse?.nameAr}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{t.toWarehouse?.nameAr}</td>
                    <td className="py-3 px-4 font-medium">{t.item.nameAr}</td>
                    <td className="py-3 px-4 tabular-nums">{t.quantity.toLocaleString('ar-SA')} {t.unit}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{t.driverName ?? '—'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        variant={statusVariantMap[t.status] as 'pending' | 'info' | 'in_transit' | 'completed' | 'cancelled'}
                        label={statusLabels[t.status]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
