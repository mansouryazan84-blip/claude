import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Phone, Mail, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockSuppliers } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import type { Contact } from '@/types';

const columns = [
  {
    key: 'code',
    header: 'الرمز',
    cell: (row: Contact) => (
      <span className="font-mono text-xs font-medium text-muted-foreground">{row.code}</span>
    ),
    sortable: true,
  },
  {
    key: 'nameAr',
    header: 'المورد',
    cell: (row: Contact) => (
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{row.nameAr}</p>
          {row.nameEn && <p className="text-xs text-muted-foreground truncate">{row.nameEn}</p>}
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'city',
    header: 'الموقع',
    cell: (row: Contact) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {row.city}
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'التواصل',
    cell: (row: Contact) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span dir="ltr">{row.phone}</span>
        </div>
        {row.email && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate max-w-[140px]">{row.email}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'balance',
    header: 'الرصيد',
    cell: (row: Contact) => {
      const balance = row.balance ?? 0;
      return (
        <div>
          <span className={`font-semibold text-sm ${balance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {formatCurrency(Math.abs(balance))}
          </span>
          {balance < 0 && (
            <p className="text-[10px] text-muted-foreground">مستحق</p>
          )}
        </div>
      );
    },
    sortable: true,
  },
  {
    key: 'paymentTerms',
    header: 'شروط الدفع',
    cell: (row: Contact) => (
      <span className="text-xs text-muted-foreground">
        {row.paymentTerms ? `${row.paymentTerms} يوم` : 'فوري'}
      </span>
    ),
  },
  {
    key: 'creditLimit',
    header: 'حد الائتمان',
    cell: (row: Contact) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {row.creditLimit ? formatCurrency(row.creditLimit) : '—'}
      </span>
    ),
  },
  {
    key: 'isActive',
    header: 'الحالة',
    cell: (row: Contact) => (
      <StatusBadge variant={row.isActive ? 'active' : 'inactive'} label={row.isActive ? 'نشط' : 'موقف'} />
    ),
  },
];

export default function Suppliers() {
  const navigate = useNavigate();
  const activeCount = mockSuppliers.filter((s) => s.isActive).length;
  const totalOwed = mockSuppliers.reduce((acc, s) => acc + Math.abs(Math.min(s.balance ?? 0, 0)), 0);
  const totalPurchases = mockSuppliers.reduce((acc, s) => acc + (s.totalPurchases ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الموردون"
        description="إدارة بيانات الموردين والأرصدة وشروط الدفع"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/suppliers/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة مورد
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="موردون نشطون" value={activeCount} icon={Building2} tone="success" />
        <StatCard title="ذمم دائنة" value={formatCurrency(totalOwed)} icon={Building2} tone="danger" />
        <StatCard title="إجمالي المشتريات" value={formatCurrency(totalPurchases)} icon={Building2} tone="info" />
      </div>

      <DataTable
        data={mockSuppliers}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو الرمز أو المدينة..."
        searchKeys={['nameAr', 'nameEn', 'code', 'city', 'email']}
        emptyState={
          <EmptyState
            icon={Building2}
            title="لا يوجد موردون"
            description="لم يتم العثور على موردين تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
