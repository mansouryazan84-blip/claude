import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockWarehouses } from '@/lib/mock-data';

const DEPARTMENTS = ['العمليات','المخزون','المالية','الأسطول','الموارد البشرية','تقنية المعلومات','المبيعات','المشتريات'];
const ROLES = ['مدير المستودع','مشرف عمليات','موظف مخزون','محاسب','سائق','موظف استقبال','مراقب جودة','مندوب مبيعات'];

export default function NewEmployee() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', employeeNo: '',
    role: '', department: '', warehouseId: '',
    phone: '', email: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '', status: 'active',
  });

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/employees');
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة موظف جديد"
        description="أدخل بيانات الموظف الجديد"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="emp-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />{saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </>
        }
      />

      <form id="emp-form" onSubmit={handleSubmit} className="space-y-5">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">البيانات الشخصية</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>الاسم بالعربية <span className="text-destructive">*</span></Label>
              <Input className={inputClass} placeholder="محمد أحمد العتيبي"
                value={form.nameAr} onChange={e => set('nameAr', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الاسم بالإنجليزية</Label>
              <Input className={inputClass} dir="ltr" placeholder="Mohammed Al-Otaibi"
                value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>رقم الموظف <span className="text-destructive">*</span></Label>
              <Input className={inputClass} dir="ltr" placeholder="EMP-007"
                value={form.employeeNo} onChange={e => set('employeeNo', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الحالة</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="on_leave">إجازة</SelectItem>
                  <SelectItem value="terminated">منتهي الخدمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات الوظيفة</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>المسمى الوظيفي <span className="text-destructive">*</span></Label>
              <Select value={form.role} onValueChange={v => set('role', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر المسمى" /></SelectTrigger>
                <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>القسم <span className="text-destructive">*</span></Label>
              <Select value={form.department} onValueChange={v => set('department', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>المستودع المعين</Label>
              <Select value={form.warehouseId} onValueChange={v => set('warehouseId', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختياري" /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.filter(w => w.isActive).map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>تاريخ التوظيف <span className="text-destructive">*</span></Label>
              <Input className={inputClass} type="date" value={form.hireDate}
                onChange={e => set('hireDate', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الراتب الأساسي (ر.س)</Label>
              <Input className={inputClass} type="number" step="100" placeholder="8000" dir="ltr"
                value={form.salary} onChange={e => set('salary', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات التواصل</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>رقم الهاتف <span className="text-destructive">*</span></Label>
              <Input className={inputClass} dir="ltr" type="tel" placeholder="+966501234567"
                value={form.phone} onChange={e => set('phone', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>البريد الإلكتروني</Label>
              <Input className={inputClass} dir="ltr" type="email" placeholder="name@company.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
