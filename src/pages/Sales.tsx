import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, TrendingUp, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';

const mockSales = [
  {
    id: 'so-1', orderNo: 'SO-2026-001', customerName: 'سوبرماركت الفرسان',
    warehouseName: 'مستودع الرياض الرئيسي', status: 'completed' as const,
    grandTotal: 18500, itemCount: 4,
    orderDate: '2026-03-15T09:00:00Z', deliveryDate: '2026-03-16T00:00:00Z',
    createdByName: 'أحمد محمد',
  },
  {
    id: 'so-2', orderNo: 'SO-2026-002', customerName: 'مطاعم الأصالة',
    warehouseName: 'مستودع جدة', status: 'approved' as const,
    grandTotal: 9250, itemCount: 2,
    orderDate: '2026-03-17T10:00:00Z', deliveryDate: '2026-03-18T00:00:00Z',
    createdByName: 'خالد الحربي',
  },
  {
    id: 'so-3', orderNo: 'SO-2026-003', customerName: 'شركة التموين الوطني',
    warehouseName: 'مستودع الرياض الرئيسي', status: 'pending' as const,
    grandTotal: 54000, itemCount: 10,
    orderDate: '2026-03-18T08:00:00Z',
    createdByName: 'أحمد محمد',
  },
];

type SaleStatus = 'draft' | 'pending' | 'approved' | 'partial' | 'completed' | 'cancelled';

const statusLabels: Record<SaleStatus, string> = {
  draft: 'مسودة',
  pending: 'بانتظار الموافقة',
  approved: 'معتمد',
  partial: 'تسليم جزئي',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusVariants: Record<SaleStatus, 'inactive' | 'pending' | 'info' | 'warning' | 'active' | 'cancelled'> = {
  draft: 'inactive',
  pending: 'pending',
  approved: 'info',
  partial: 'warning',
  completed: 'active',
  cancelled: 'cancelled',
};

type MockSale = typeof mockSales[0];

const columns = [
  {
    key: 'orderNo',
    header: 'رقم الطلب',
    cell: (row: MockSale) => (
      <span className="font-mono text-xs font-semibold text-foreground">{row.orderNo}</span>
    ),
    sortable: true,
  },
  {
    key: 'customerName',
    header: 'العميل',
    cell: (row: MockSale) => <span className="text-sm font-medium">{row.customerName}</span>,
    sortable: true,
  },
  {
    key: 'warehouseName',
    header: 'المستودع',
    cell: (row: MockSale) => <span className="text-xs text-muted-foreground">{row.warehouseName}</span>,
  },
  {
    key: 'itemCount',
    header: 'عدد الأصناف',
    cell: (row: MockSale) => <span className="text-sm tabular-nums">{row.itemCount}</span>,
  },
  {
    key: 'grandTotal',
    header: 'الإجمالي',
    cell: (row: MockSale) => (
      <span className="font-semibold text-sm tabular-nums">{formatCurrency(row.grandTotal)}</span>
    ),
    sortable: true,
  },
  {
    key: 'orderDate',
    header: 'تاريخ الطلب',
    cell: (row: MockSale) => <span className="text-xs text-muted-foreground">{formatDate(row.orderDate)}</span>,
    sortable: true,
  },
  {
    key: 'deliveryDate',
    header: 'تاريخ التسليم',
    cell: (row: MockSale) => (
      <span className="text-xs text-muted-foreground">
        {row.deliveryDate ? formatDate(row.deliveryDate) : '—'}
      </span>
    ),
  },
  {
    key: 'createdByName',
    header: 'أنشأه',
    cell: (row: MockSale) => <span className="text-xs text-muted-foreground">{row.createdByName}</span>,
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: MockSale) => (
      <StatusBadge
        variant={statusVariants[row.status]}
        label={statusLabels[row.status]}
      />
    ),
  },
];

export default function Sales() {
  const navigate = useNavigate();
  const todayTotal = mockSales.filter((o) => o.status === 'completed').reduce((s, o) => s + o.grandTotal, 0);
  const pendingCount = mockSales.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="المبيعات"
        description="إدارة أوامر البيع وتسليم البضائع للعملاء"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate('/sales/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              أمر بيع جديد
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="مبيعات اليوم" value={formatCurrency(todayTotal)} icon={TrendingUp} tone="success" />
        <StatCard title="بانتظار الموافقة" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard title="إجمالي الطلبات" value={mockSales.length} icon={ShoppingBag} tone="default" />
      </div>

      <DataTable
        data={mockSales}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث برقم الطلب أو العميل..."
        searchKeys={['orderNo', 'customerName', 'warehouseName']}
        emptyState={
          <EmptyState
            icon={ShoppingBag}
            title="لا توجد أوامر بيع"
            description="لم يتم العثور على أوامر بيع تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
