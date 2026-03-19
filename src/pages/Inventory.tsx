import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Filter, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockItems, mockCategories } from '@/lib/mock-data';
import type { Item } from '@/types';
import { cn } from '@/lib/utils';

type StockFilter = 'all' | 'ok' | 'critical' | 'out';

const storageTypeLabels: Record<string, string> = {
  dry: 'جاف',
  refrigerated: 'مبرد',
  frozen: 'مجمد',
  controlled: 'متحكم',
};

function getStockStatus(item: Item): { label: string; variant: 'active' | 'warning' | 'critical' } {
  const stock = item.currentStock ?? 0;
  if (stock === 0) return { label: 'نفد المخزون', variant: 'critical' };
  if (stock < item.minimumStock) return { label: 'حرج', variant: 'critical' };
  if (stock < item.reorderPoint) return { label: 'منخفض', variant: 'warning' };
  return { label: 'متوفر', variant: 'active' };
}

const columns = [
  {
    key: 'sku',
    header: 'الرمز',
    cell: (row: Item) => (
      <span className="font-mono text-xs font-medium text-foreground">{row.sku}</span>
    ),
    sortable: true,
  },
  {
    key: 'nameAr',
    header: 'الصنف',
    cell: (row: Item) => (
      <div>
        <p className="font-medium text-foreground text-sm">{row.nameAr}</p>
        {row.brand && <p className="text-xs text-muted-foreground">{row.brand}</p>}
      </div>
    ),
    sortable: true,
  },
  {
    key: 'category',
    header: 'الفئة',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground">{row.category.nameAr}</span>
    ),
  },
  {
    key: 'storageType',
    header: 'التخزين',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground">
        {storageTypeLabels[row.storageType]}
      </span>
    ),
  },
  {
    key: 'currentStock',
    header: 'الرصيد',
    cell: (row: Item) => {
      const stock = row.currentStock ?? 0;
      const { variant } = getStockStatus(row);
      return (
        <span className={cn(
          'font-semibold tabular-nums',
          variant === 'critical' ? 'text-rose-600' :
          variant === 'warning' ? 'text-amber-600' :
          'text-foreground'
        )}>
          {stock.toLocaleString('ar-SA')} {row.baseUnit}
        </span>
      );
    },
    sortable: true,
  },
  {
    key: 'minimumStock',
    header: 'الحد الأدنى',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {row.minimumStock.toLocaleString('ar-SA')}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: Item) => {
      const { label, variant } = getStockStatus(row);
      return <StatusBadge variant={variant} label={label} />;
    },
  },
];

export default function Inventory() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      if (categoryFilter !== 'all' && item.category.id !== categoryFilter) return false;
      if (stockFilter === 'ok') {
        const stock = item.currentStock ?? 0;
        return stock >= item.minimumStock;
      }
      if (stockFilter === 'critical') {
        const stock = item.currentStock ?? 0;
        return stock > 0 && stock < item.minimumStock;
      }
      if (stockFilter === 'out') return (item.currentStock ?? 0) === 0;
      return true;
    });
  }, [categoryFilter, stockFilter]);

  const criticalCount = mockItems.filter((i) => (i.currentStock ?? 0) < i.minimumStock).length;
  const outCount = mockItems.filter((i) => (i.currentStock ?? 0) === 0).length;
  const okCount = mockItems.filter((i) => (i.currentStock ?? 0) >= i.minimumStock).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة المخزون"
        description="عرض وإدارة جميع الأصناف والكميات"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/items/new')}
            >
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة صنف
            </Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-3">
        <StatCard title="متوفر" value={okCount} icon={CheckCircle} tone="success" />
        <StatCard title="مخزون حرج" value={criticalCount} icon={AlertTriangle} tone="danger" />
        <StatCard title="نفد المخزون" value={outCount} icon={Package} tone="warning" />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو الرمز أو الباركود..."
        searchKeys={['nameAr', 'nameEn', 'sku', 'barcode', 'brand']}
        toolbar={
          <>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockFilter)}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="ok">متوفر</SelectItem>
                <SelectItem value="critical">حرج</SelectItem>
                <SelectItem value="out">نفد</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-1.5" />
              فلاتر
            </Button>
          </>
        }
        emptyState={
          <EmptyState
            icon={Package}
            title="لا توجد أصناف"
            description="لم يتم العثور على أصناف تطابق معايير البحث"
          />
        }
        onRowClick={(row) => navigate(`/items/${row.id}`)}
      />
    </div>
  );
}
