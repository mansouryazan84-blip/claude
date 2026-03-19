import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/tables/DataTable';
import { formatDate, formatCurrency } from '@/lib/utils';

// Stub data - to be replaced with API data via React Query
const mockOrders = [
  {
    id: 'po-1', orderNo: 'PO-2026-001', supplierName: 'شركة الأغذية الخليجية',
    warehouseName: 'مستودع الرياض الرئيسي', status: 'approved' as const,
    grandTotal: 45000, itemCount: 3,
    orderDate: '2026-03-15T09:00:00Z', expectedDate: '2026-03-22T00:00:00Z',
    createdByName: 'أحمد محمد',
  },
  {
    id: 'po-2', orderNo: 'PO-2026-002', supplierName: 'مؤسسة النور للتجارة',
    warehouseName: 'مستودع جدة', status: 'pending' as const,
    grandTotal: 28750, itemCount: 5,
    orderDate: '2026-03-16T11:00:00Z', expectedDate: '2026-03-25T00:00:00Z',
    createdByName: 'خالد الحربي',
  },
  {
    id: 'po-3', orderNo: 'PO-2026-003', supplierName: 'شركة الماسة للاستيراد',
    warehouseName: 'مستودع الدمام', status: 'completed' as const,
    grandTotal: 92300, itemCount: 8,
    orderDate: '2026-03-10T08:00:00Z', expectedDate: '2026-03-18T00:00:00Z',
    createdByName: 'فهد السبيعي',
  },
];

type OrderStatus = 'draft' | 'pending' | 'approved' | 'partial' | 'completed' | 'cancelled';

const statusLabels: Record<OrderStatus, string> = {
  draft: 'مسودة',
  pending: 'بانتظار الموافقة',
  approved: 'معتمد',
  partial: 'استلام جزئي',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusVariants: Record<OrderStatus, 'inactive' | 'pending' | 'info' | 'warning' | 'active' | 'cancelled'> = {
  draft: 'inactive',
  pending: 'pending',
  approved: 'info',
  partial: 'warning',
  completed: 'active',
  cancelled: 'cancelled',
};

type MockOrder = typeof mockOrders[0];

const columns = [
  {
    key: 'orderNo',
    header: 'رقم الطلب',
    cell: (row: MockOrder) => (
      <span className="font-mono text-xs font-semibold text-foreground">{row.orderNo}</span>
    ),
    sortable: true,
  },
  {
    key: 'supplierName',
    header: 'المورد',
    cell: (row: MockOrder) => <span className="text-sm font-medium">{row.supplierName}</span>,
    sortable: true,
  },
  {
    key: 'warehouseName',
    header: 'المستودع',
    cell: (row: MockOrder) => <span className="text-xs text-muted-foreground">{row.warehouseName}</span>,
  },
  {
    key: 'itemCount',
    header: 'عدد الأصناف',
    cell: (row: MockOrder) => <span className="text-sm tabular-nums">{row.itemCount}</span>,
  },
  {
    key: 'grandTotal',
    header: 'الإجمالي',
    cell: (row: MockOrder) => (
      <span className="font-semibold text-sm tabular-nums">{formatCurrency(row.grandTotal)}</span>
    ),
    sortable: true,
  },
  {
    key: 'orderDate',
    header: 'تاريخ الطلب',
    cell: (row: MockOrder) => <span className="text-xs text-muted-foreground">{formatDate(row.orderDate)}</span>,
    sortable: true,
  },
  {
    key: 'expectedDate',
    header: 'تاريخ التسليم المتوقع',
    cell: (row: MockOrder) => (
      <span className="text-xs text-muted-foreground">
        {row.expectedDate ? formatDate(row.expectedDate) : '—'}
      </span>
    ),
  },
  {
    key: 'createdByName',
    header: 'أنشأه',
    cell: (row: MockOrder) => <span className="text-xs text-muted-foreground">{row.createdByName}</span>,
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: MockOrder) => (
      <StatusBadge
        variant={statusVariants[row.status]}
        label={statusLabels[row.status]}
      />
    ),
  },
];

export default function Purchases() {
  const navigate = useNavigate();
  const pendingCount = mockOrders.filter((o) => o.status === 'pending').length;
  const approvedCount = mockOrders.filter((o) => o.status === 'approved').length;
  const totalValue = mockOrders.reduce((s, o) => s + o.grandTotal, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="أوامر الشراء"
        description="إدارة طلبات الشراء واستلام البضائع من الموردين"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate('/purchases/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              طلب شراء جديد
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="بانتظار الموافقة" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard title="معتمدة" value={approvedCount} icon={CheckCircle} tone="info" />
        <StatCard title="إجمالي القيمة" value={formatCurrency(totalValue)} icon={ShoppingCart} tone="success" />
      </div>

      <DataTable
        data={mockOrders}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث برقم الطلب أو المورد..."
        searchKeys={['orderNo', 'supplierName', 'warehouseName']}
        emptyState={
          <EmptyState
            icon={ShoppingCart}
            title="لا توجد أوامر شراء"
            description="لم يتم العثور على أوامر شراء تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
