import { useNavigate } from 'react-router-dom';
import { Plus, Truck, Wrench, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockVehicles } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { Vehicle, VehicleStatus } from '@/types';

const statusLabels: Record<VehicleStatus, string> = {
  available: 'متاح',
  in_use: 'في العمل',
  maintenance: 'صيانة',
  out_of_service: 'خارج الخدمة',
};

const statusVariants: Record<VehicleStatus, 'active' | 'info' | 'maintenance' | 'inactive'> = {
  available: 'active',
  in_use: 'info',
  maintenance: 'maintenance',
  out_of_service: 'inactive',
};

const columns = [
  {
    key: 'plateNo',
    header: 'رقم اللوحة',
    cell: (row: Vehicle) => (
      <span className="font-mono font-semibold text-sm text-foreground">{row.plateNo}</span>
    ),
    sortable: true,
  },
  {
    key: 'type',
    header: 'النوع والطراز',
    cell: (row: Vehicle) => (
      <div>
        <p className="font-medium text-sm">{row.type}</p>
        <p className="text-xs text-muted-foreground">{row.brand} {row.model} ({row.year})</p>
      </div>
    ),
  },
  {
    key: 'capacity',
    header: 'الحمولة',
    cell: (row: Vehicle) => (
      <span className="text-sm tabular-nums">
        {row.capacity.toLocaleString('ar-SA')} {row.unit}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'driverName',
    header: 'السائق',
    cell: (row: Vehicle) => (
      <span className="text-sm">{row.driverName ?? <span className="text-muted-foreground">—</span>}</span>
    ),
  },
  {
    key: 'mileage',
    header: 'العداد (كم)',
    cell: (row: Vehicle) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {row.mileage ? row.mileage.toLocaleString('ar-SA') : '—'}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'nextMaintenanceDate',
    header: 'الصيانة القادمة',
    cell: (row: Vehicle) => (
      <span className="text-xs text-muted-foreground">
        {row.nextMaintenanceDate ? formatDate(row.nextMaintenanceDate) : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: Vehicle) => (
      <StatusBadge variant={statusVariants[row.status]} label={statusLabels[row.status]} />
    ),
  },
];

export default function Fleet() {
  const navigate = useNavigate();
  const availableCount = mockVehicles.filter((v) => v.status === 'available').length;
  const inUseCount = mockVehicles.filter((v) => v.status === 'in_use').length;
  const maintenanceCount = mockVehicles.filter((v) => v.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأسطول"
        description="إدارة مركبات النقل وجدول الصيانة"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/fleet/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة مركبة
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-4">
        <StatCard title="إجمالي المركبات" value={mockVehicles.length} icon={Truck} tone="default" />
        <StatCard title="متاحة" value={availableCount} icon={CheckCircle} tone="success" />
        <StatCard title="في العمل" value={inUseCount} icon={Truck} tone="info" />
        <StatCard title="في الصيانة" value={maintenanceCount} icon={Wrench} tone="warning" />
      </div>

      <DataTable
        data={mockVehicles}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث برقم اللوحة أو الطراز أو السائق..."
        searchKeys={['plateNo', 'brand', 'model', 'type', 'driverName']}
        emptyState={
          <EmptyState
            icon={Truck}
            title="لا توجد مركبات"
            description="لم يتم العثور على مركبات تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
