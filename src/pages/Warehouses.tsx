import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Warehouse, MapPin, Phone, User, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockWarehouses } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  main: 'رئيسي',
  branch: 'فرعي',
  transit: 'عبور',
  cold_storage: 'تبريد',
};

const typeColors: Record<string, string> = {
  main: 'bg-blue-50 text-blue-700 border-blue-200',
  branch: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  transit: 'bg-amber-50 text-amber-700 border-amber-200',
  cold_storage: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function Warehouses() {
  const navigate = useNavigate();
  const activeCount = mockWarehouses.filter((w) => w.isActive).length;
  const totalCapacity = mockWarehouses.reduce((s, w) => s + (w.capacity ?? 0), 0);
  const usedCapacity = mockWarehouses.reduce((s, w) => s + (w.usedCapacity ?? 0), 0);
  const usagePercent = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="المستودعات"
        description="إدارة المستودعات والفروع ومتابعة السعة"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate('/warehouses/new')}>
            <Plus className="h-4 w-4 ml-1.5" />
            إضافة مستودع
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid gap-4 grid-cols-3">
        <StatCard title="مستودعات نشطة" value={activeCount} icon={Warehouse} tone="success" />
        <StatCard
          title="إجمالي السعة (طن)"
          value={(totalCapacity / 1000).toLocaleString('ar-SA')}
          icon={BarChart3}
          tone="info"
        />
        <StatCard
          title="نسبة الإشغال"
          value={`${usagePercent}%`}
          icon={BarChart3}
          tone={usagePercent > 85 ? 'danger' : usagePercent > 70 ? 'warning' : 'default'}
        />
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockWarehouses.map((wh) => {
          const used = wh.usedCapacity ?? 0;
          const cap = wh.capacity ?? 1;
          const pct = Math.round((used / cap) * 100);
          const isFull = pct > 85;

          return (
            <Card
              key={wh.id}
              className="glass-card hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full border font-medium shrink-0',
                          typeColors[wh.type],
                        )}
                      >
                        {typeLabels[wh.type]}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{wh.code}</span>
                    </div>
                    <CardTitle className="text-base font-semibold truncate">
                      {wh.nameAr}
                    </CardTitle>
                  </div>
                  <StatusBadge variant={wh.isActive ? 'active' : 'inactive'} label={wh.isActive ? 'نشط' : 'متوقف'} />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{wh.address}، {wh.city}</span>
                  </div>
                  {wh.managerName && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span>{wh.managerName}</span>
                    </div>
                  )}
                  {wh.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span dir="ltr">{wh.phone}</span>
                    </div>
                  )}
                </div>

                {wh.capacity && (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">الإشغال</span>
                      <span className={cn('font-semibold', isFull ? 'text-rose-600' : 'text-foreground')}>
                        {pct}%
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className={cn(
                        'h-1.5',
                        isFull ? '[&>div]:bg-rose-500' :
                        pct > 70 ? '[&>div]:bg-amber-500' :
                        '[&>div]:bg-emerald-500'
                      )}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{used.toLocaleString('ar-SA')} كجم</span>
                      <span>{cap.toLocaleString('ar-SA')} كجم</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
