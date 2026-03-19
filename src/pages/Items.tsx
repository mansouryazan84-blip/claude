import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Plus, Download, Package, Snowflake, Thermometer, Wind, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockItems, mockCategories } from '@/lib/mock-data';
import type { Item, ItemStatus, StorageType } from '@/types';
import { cn } from '@/lib/utils';

const statusLabels: Record<ItemStatus, string> = {
  active: 'نشط',
  discontinued: 'متوقف',
  pending_approval: 'بانتظار الاعتماد',
};

const statusVariants: Record<ItemStatus, 'active' | 'inactive' | 'pending'> = {
  active: 'active',
  discontinued: 'inactive',
  pending_approval: 'pending',
};

const storageIcons: Record<StorageType, typeof Package> = {
  dry: Wind,
  refrigerated: Thermometer,
  frozen: Snowflake,
  controlled: Shield,
};

const storageLabels: Record<StorageType, string> = {
  dry: 'جاف',
  refrigerated: 'مبرد',
  frozen: 'مجمد',
  controlled: 'متحكم',
};

const storageColors: Record<StorageType, string> = {
  dry: 'text-amber-600',
  refrigerated: 'text-blue-600',
  frozen: 'text-cyan-600',
  controlled: 'text-violet-600',
};

const columns = [
  {
    key: 'sku',
    header: 'الرمز',
    cell: (row: Item) => (
      <span className="font-mono text-xs font-semibold text-muted-foreground">{row.sku}</span>
    ),
    sortable: true,
  },
  {
    key: 'nameAr',
    header: 'الصنف',
    cell: (row: Item) => (
      <div>
        <p className="font-medium text-sm text-foreground">{row.nameAr}</p>
        <p className="text-xs text-muted-foreground">{row.nameEn}</p>
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
    key: 'brand',
    header: 'العلامة التجارية',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground">{row.brand ?? '—'}</span>
    ),
  },
  {
    key: 'storageType',
    header: 'التخزين',
    cell: (row: Item) => {
      const Icon = storageIcons[row.storageType];
      return (
        <div className="flex items-center gap-1.5">
          <Icon className={cn('h-3.5 w-3.5', storageColors[row.storageType])} />
          <span className="text-xs text-muted-foreground">{storageLabels[row.storageType]}</span>
        </div>
      );
    },
  },
  {
    key: 'baseUnit',
    header: 'الوحدة',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground">{row.baseUnit}</span>
    ),
  },
  {
    key: 'minimumStock',
    header: 'الحد الأدنى',
    cell: (row: Item) => (
      <span className="text-xs tabular-nums text-muted-foreground">
        {row.minimumStock.toLocaleString('ar-SA')}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'shelfLifeDays',
    header: 'مدة الصلاحية',
    cell: (row: Item) => (
      <span className="text-xs text-muted-foreground">
        {row.shelfLifeDays ? `${row.shelfLifeDays} يوم` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: Item) => (
      <StatusBadge variant={statusVariants[row.status]} label={statusLabels[row.status]} />
    ),
  },
];

export default function Items() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [storageFilter, setStorageFilter] = useState<StorageType | 'all'>('all');

  const filtered = useMemo(() => {
    return mockItems.filter((item) => {
      if (categoryFilter !== 'all' && item.category.id !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (storageFilter !== 'all' && item.storageType !== storageFilter) return false;
      return true;
    });
  }, [categoryFilter, statusFilter, storageFilter]);

  const activeCount = mockItems.filter((i) => i.status === 'active').length;
  const batchTracked = mockItems.filter((i) => i.isBatchTracked).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأصناف"
        description="إدارة كتالوج الأصناف والمنتجات"
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

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="إجمالي الأصناف" value={mockItems.length} icon={Package} tone="default" />
        <StatCard title="أصناف نشطة" value={activeCount} icon={Package} tone="success" />
        <StatCard title="تتبع دفعات" value={batchTracked} icon={Package} tone="info" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو الرمز أو الباركود أو العلامة..."
        searchKeys={['nameAr', 'nameEn', 'sku', 'barcode', 'brand']}
        toolbar={
          <>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ItemStatus | 'all')}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {(Object.keys(statusLabels) as ItemStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={storageFilter} onValueChange={(v) => setStorageFilter(v as StorageType | 'all')}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="التخزين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                {(Object.keys(storageLabels) as StorageType[]).map((s) => (
                  <SelectItem key={s} value={s}>{storageLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
