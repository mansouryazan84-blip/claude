import { useNavigate } from 'react-router-dom';
import { Plus, Users, Phone, Mail, MapPin, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockCustomers } from '@/lib/mock-data';
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
    header: 'العميل',
    cell: (row: Contact) => (
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Users className="h-4 w-4 text-accent" />
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
    header: 'المدينة',
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
    header: 'الرصيد المستحق',
    cell: (row: Contact) => {
      const balance = row.balance ?? 0;
      return (
        <span className={`font-semibold text-sm ${balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {formatCurrency(balance)}
        </span>
      );
    },
    sortable: true,
  },
  {
    key: 'creditLimit',
    header: 'حد الائتمان',
    cell: (row: Contact) => (
      <span className="text-xs text-muted-foreground">
        {row.creditLimit ? formatCurrency(row.creditLimit) : '—'}
      </span>
    ),
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
    key: 'totalSales',
    header: 'إجمالي المبيعات',
    cell: (row: Contact) => (
      <span className="text-xs font-medium tabular-nums">
        {row.totalSales ? formatCurrency(row.totalSales) : '—'}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'isActive',
    header: 'الحالة',
    cell: (row: Contact) => (
      <StatusBadge variant={row.isActive ? 'active' : 'inactive'} label={row.isActive ? 'نشط' : 'موقف'} />
    ),
  },
];

export default function Customers() {
  const navigate = useNavigate();
  const activeCount = mockCustomers.filter((c) => c.isActive).length;
  const totalReceivable = mockCustomers.reduce((acc, c) => acc + (c.balance ?? 0), 0);
  const totalSales = mockCustomers.reduce((acc, c) => acc + (c.totalSales ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        description="إدارة بيانات العملاء والأرصدة وتاريخ المبيعات"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/customers/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة عميل
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="عملاء نشطون" value={activeCount} icon={Users} tone="success" />
        <StatCard title="ذمم مدينة" value={formatCurrency(totalReceivable)} icon={Users} tone="warning" />
        <StatCard title="إجمالي المبيعات" value={formatCurrency(totalSales)} icon={TrendingUp} tone="info" />
      </div>

      <DataTable
        data={mockCustomers}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو الرمز أو المدينة..."
        searchKeys={['nameAr', 'nameEn', 'code', 'city', 'email']}
        emptyState={
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء"
            description="لم يتم العثور على عملاء تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
