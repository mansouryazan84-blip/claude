import { FileText, Shield, User, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockAuditLogs } from '@/lib/mock-data';
import { formatDate, formatRelative } from '@/lib/utils';
import type { AuditLog, UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roleLabels: Record<UserRole, string> = {
  admin: 'مدير النظام',
  manager: 'مدير',
  operator: 'مشغل',
  viewer: 'مشاهد',
};

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: 'إنشاء', color: 'text-emerald-600 bg-emerald-50' },
  update: { label: 'تعديل', color: 'text-blue-600 bg-blue-50' },
  delete: { label: 'حذف', color: 'text-rose-600 bg-rose-50' },
  approve: { label: 'اعتماد', color: 'text-violet-600 bg-violet-50' },
  cancel: { label: 'إلغاء', color: 'text-orange-600 bg-orange-50' },
};

const resourceLabels: Record<string, string> = {
  transfer: 'مناقلة',
  item: 'صنف',
  purchase: 'مشتريات',
  sale: 'مبيعات',
  employee: 'موظف',
  warehouse: 'مستودع',
};

const columns = [
  {
    key: 'createdAt',
    header: 'الوقت',
    cell: (row: AuditLog) => (
      <div>
        <p className="text-xs font-medium text-foreground">{formatDate(row.createdAt, 'dd/MM/yyyy HH:mm')}</p>
        <p className="text-[10px] text-muted-foreground">{formatRelative(row.createdAt)}</p>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'userName',
    header: 'المستخدم',
    cell: (row: AuditLog) => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{row.userName}</p>
          <p className="text-xs text-muted-foreground">{roleLabels[row.userRole]}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'الإجراء',
    cell: (row: AuditLog) => {
      const a = actionLabels[row.action] ?? { label: row.action, color: 'text-muted-foreground bg-muted' };
      return (
        <span className={cn('text-xs px-2 py-1 rounded-md font-medium', a.color)}>
          {a.label}
        </span>
      );
    },
  },
  {
    key: 'resource',
    header: 'المورد',
    cell: (row: AuditLog) => (
      <div>
        <p className="text-sm font-medium">{resourceLabels[row.resource] ?? row.resource}</p>
        {row.resourceId && (
          <p className="text-xs text-muted-foreground font-mono">{row.resourceId}</p>
        )}
      </div>
    ),
  },
  {
    key: 'ipAddress',
    header: 'عنوان IP',
    cell: (row: AuditLog) => (
      <span className="font-mono text-xs text-muted-foreground" dir="ltr">{row.ipAddress ?? '—'}</span>
    ),
  },
];

export default function Audit() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="سجل التدقيق"
        description="تتبع جميع الإجراءات والتغييرات في النظام"
      />

      <DataTable
        data={mockAuditLogs}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالمستخدم أو الإجراء أو المورد..."
        searchKeys={['userName', 'action', 'resource', 'resourceId']}
        emptyState={
          <EmptyState
            icon={Shield}
            title="لا توجد سجلات"
            description="لم يتم تسجيل أي إجراءات حتى الآن"
          />
        }
      />
    </div>
  );
}
