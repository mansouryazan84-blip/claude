import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';

const CITIES = ['الرياض','جدة','الدمام','المدينة المنورة','مكة المكرمة','الطائف','أبها','تبوك','القصيم','حائل','ينبع','جازان'];

export default function NewWarehouse() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', nameAr: '', nameEn: '', type: 'branch',
    city: '', address: '',
    managerName: '', phone: '',
    capacity: '', isActive: true,
  });

  const set = (f: string, v: unknown) => setForm(p => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/warehouses');
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة مستودع جديد"
        description="أدخل بيانات المستودع الجديد"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/warehouses')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="wh-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />{saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </>
        }
      />

      <form id="wh-form" onSubmit={handleSubmit} className="space-y-5">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات المستودع</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>الاسم بالعربية <span className="text-destructive">*</span></Label>
              <Input className={inputClass} placeholder="مستودع جدة الجديد"
                value={form.nameAr} onChange={e => set('nameAr', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الاسم بالإنجليزية</Label>
              <Input className={inputClass} dir="ltr" placeholder="New Jeddah Warehouse"
                value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>الرمز <span className="text-destructive">*</span></Label>
              <Input className={inputClass} dir="ltr" placeholder="JED-02"
                value={form.code} onChange={e => set('code', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>النوع <span className="text-destructive">*</span></Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">رئيسي</SelectItem>
                  <SelectItem value="branch">فرعي</SelectItem>
                  <SelectItem value="transit">عبور</SelectItem>
                  <SelectItem value="cold_storage">تخزين بارد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>المدينة <span className="text-destructive">*</span></Label>
              <Select value={form.city} onValueChange={v => set('city', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>السعة الاستيعابية (كجم)</Label>
              <Input className={inputClass} type="number" step="1000" placeholder="20000" dir="ltr"
                value={form.capacity} onChange={e => set('capacity', e.target.value)} />
            </div>
            <div className={fieldClass + " md:col-span-2"}>
              <Label>العنوان التفصيلي</Label>
              <Textarea placeholder="الشارع، الحي، المدينة..." rows={2}
                value={form.address} onChange={(e) => set('address', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات المسؤول</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={fieldClass + " md:col-span-2"}>
              <Label>اسم مدير المستودع</Label>
              <Input className={inputClass} placeholder="محمد العتيبي"
                value={form.managerName} onChange={e => set('managerName', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>رقم الهاتف</Label>
              <Input className={inputClass} dir="ltr" type="tel" placeholder="+966501234567"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
              <Label className="cursor-pointer">{form.isActive ? 'مستودع نشط' : 'مستودع موقف'}</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
