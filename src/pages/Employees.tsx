import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, UserCheck, Phone, Mail, Briefcase, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockEmployees } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { Employee, EmployeeStatus } from '@/types';

const statusLabels: Record<EmployeeStatus, string> = {
  active: 'نشط',
  on_leave: 'إجازة',
  terminated: 'منتهي الخدمة',
};

const statusVariants: Record<EmployeeStatus, 'active' | 'warning' | 'inactive'> = {
  active: 'active',
  on_leave: 'warning',
  terminated: 'inactive',
};

const departments = [...new Set(mockEmployees.map((e) => e.department))];

const columns = [
  {
    key: 'employeeNo',
    header: 'رقم الموظف',
    cell: (row: Employee) => (
      <span className="font-mono text-xs font-medium text-muted-foreground">{row.employeeNo}</span>
    ),
    sortable: true,
  },
  {
    key: 'nameAr',
    header: 'الموظف',
    cell: (row: Employee) => (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center shrink-0 font-semibold text-sm text-accent">
          {row.nameAr.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm">{row.nameAr}</p>
          {row.nameEn && <p className="text-xs text-muted-foreground">{row.nameEn}</p>}
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'role',
    header: 'المنصب',
    cell: (row: Employee) => (
      <div>
        <p className="text-sm font-medium">{row.role}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <Briefcase className="h-3 w-3" />
          {row.department}
        </div>
      </div>
    ),
  },
  {
    key: 'warehouseName',
    header: 'المستودع',
    cell: (row: Employee) => (
      <span className="text-xs text-muted-foreground">{row.warehouseName ?? '—'}</span>
    ),
  },
  {
    key: 'phone',
    header: 'التواصل',
    cell: (row: Employee) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span dir="ltr">{row.phone}</span>
        </div>
        {row.email && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{row.email}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'hireDate',
    header: 'تاريخ التوظيف',
    cell: (row: Employee) => (
      <span className="text-xs text-muted-foreground">{formatDate(row.hireDate)}</span>
    ),
    sortable: true,
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: Employee) => (
      <StatusBadge variant={statusVariants[row.status]} label={statusLabels[row.status]} />
    ),
  },
];

export default function Employees() {
  const navigate = useNavigate();
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');

  const filtered = mockEmployees.filter((e) => {
    if (deptFilter !== 'all' && e.department !== deptFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const activeCount = mockEmployees.filter((e) => e.status === 'active').length;
  const onLeaveCount = mockEmployees.filter((e) => e.status === 'on_leave').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الموظفون"
        description="إدارة بيانات الموظفين والأقسام"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1.5" />
              تصدير
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/employees/new')}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة موظف
            </Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="إجمالي الموظفين" value={mockEmployees.length} icon={Users} tone="default" />
        <StatCard title="نشطون" value={activeCount} icon={UserCheck} tone="success" />
        <StatCard title="في إجازة" value={onLeaveCount} icon={UserCheck} tone="warning" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو الرقم الوظيفي..."
        searchKeys={['nameAr', 'nameEn', 'employeeNo', 'role', 'department']}
        toolbar={
          <>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأقسام</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EmployeeStatus | 'all')}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {(Object.keys(statusLabels) as EmployeeStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        emptyState={
          <EmptyState
            icon={Users}
            title="لا يوجد موظفون"
            description="لم يتم العثور على موظفين تطابق معايير البحث"
          />
        }
      />
    </div>
  );
}
