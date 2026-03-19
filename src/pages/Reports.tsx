import { BarChart3, TrendingUp, Package, ArrowLeftRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';

const reportTypes = [
  {
    id: 'inventory',
    title: 'تقرير المخزون',
    description: 'عرض تفصيلي لجميع الأصناف والكميات والقيم',
    icon: Package,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    id: 'movements',
    title: 'تقرير حركة المخزون',
    description: 'سجل كامل لجميع حركات الدخول والخروج والتحويلات',
    icon: ArrowLeftRight,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  },
  {
    id: 'sales',
    title: 'تقرير المبيعات',
    description: 'تحليل مفصل لأداء المبيعات حسب الفترة والعميل والصنف',
    icon: TrendingUp,
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
  },
  {
    id: 'purchases',
    title: 'تقرير المشتريات',
    description: 'ملخص عمليات الشراء والموردين وتكاليف الاقتناء',
    icon: BarChart3,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  },
  {
    id: 'expiry',
    title: 'تقرير انتهاء الصلاحية',
    description: 'الأصناف التي تقترب أو تجاوزت تاريخ انتهاء الصلاحية',
    icon: FileText,
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
  },
  {
    id: 'valuation',
    title: 'تقرير تقييم المخزون',
    description: 'القيمة الإجمالية للمخزون بأسعار التكلفة والسوق',
    icon: BarChart3,
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير والتحليلات"
        description="استعراض وتصدير التقارير الإدارية والتشغيلية"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className="glass-card hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${report.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    تصدير PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
