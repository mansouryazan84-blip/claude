import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Plus, ArrowLeftRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockTransfers, mockWarehouses } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { StockMovement, MovementStatus } from '@/types';

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

const columns = [
  {
    key: 'referenceNo',
    header: 'رقم المرجع',
    cell: (row: StockMovement) => (
      <span className="font-mono text-xs font-semibold text-foreground">{row.referenceNo}</span>
    ),
    sortable: true,
  },
  {
    key: 'item',
    header: 'الصنف',
    cell: (row: StockMovement) => (
      <div>
        <p className="font-medium text-sm">{row.item.nameAr}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.item.sku}</p>
      </div>
    ),
  },
  {
    key: 'from',
    header: 'من',
    cell: (row: StockMovement) => (
      <span className="text-xs text-muted-foreground">{row.fromWarehouse?.nameAr ?? '—'}</span>
    ),
  },
  {
    key: 'to',
    header: 'إلى',
    cell: (row: StockMovement) => (
      <span className="text-xs text-muted-foreground">{row.toWarehouse?.nameAr ?? '—'}</span>
    ),
  },
  {
    key: 'quantity',
    header: 'الكمية',
    cell: (row: StockMovement) => (
      <span className="font-medium tabular-nums">
        {row.quantity.toLocaleString('ar-SA')} {row.unit}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'driverName',
    header: 'السائق',
    cell: (row: StockMovement) => (
      <span className="text-xs text-muted-foreground">{row.driverName ?? '—'}</span>
    ),
  },
  {
    key: 'createdAt',
    header: 'التاريخ',
    cell: (row: StockMovement) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {formatDate(row.createdAt)}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: StockMovement) => (
      <StatusBadge variant={statusVariantMap[row.status]} label={statusLabels[row.status]} />
    ),
  },
];

export default function Transfers() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<MovementStatus | 'all'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockTransfers.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (
        warehouseFilter !== 'all' &&
        t.fromWarehouseId !== warehouseFilter &&
        t.toWarehouseId !== warehouseFilter
      )
        return false;
      return true;
    });
  }, [statusFilter, warehouseFilter]);

  const pendingCount = mockTransfers.filter((t) => t.status === 'pending').length;
  const inTransitCount = mockTransfers.filter((t) => t.status === 'in_transit').length;
  const completedCount = mockTransfers.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="المناقلات"
        description="إدارة طلبات نقل البضائع بين المستودعات"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate('/transfers/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              طلب مناقلة جديد
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard
          title="بانتظار الموافقة"
          value={pendingCount}
          icon={ArrowLeftRight}
          tone="warning"
        />
        <StatCard
          title="قيد النقل"
          value={inTransitCount}
          icon={ArrowLeftRight}
          tone="info"
        />
        <StatCard
          title="مكتملة هذا الشهر"
          value={completedCount}
          icon={ArrowLeftRight}
          tone="success"
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث برقم المرجع أو الصنف أو السائق..."
        searchKeys={['referenceNo', 'driverName']}
        toolbar={
          <>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MovementStatus | 'all')}>
              <SelectTrigger className="h-9 w-44 text-xs">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {(Object.keys(statusLabels) as MovementStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="h-9 w-44 text-xs">
                <SelectValue placeholder="المستودع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المستودعات</SelectItem>
                {mockWarehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        emptyState={
          <EmptyState
            icon={ArrowLeftRight}
            title="لا توجد مناقلات"
            description="لم يتم العثور على مناقلات تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
