import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';

const VEHICLE_TYPES = ['شاحنة كبيرة','شاحنة متوسطة','شاحنة صغيرة','مركبة مبردة','سيارة توصيل','رافعة شوكية'];
const BRANDS = ['Mercedes','Volvo','MAN','Iveco','Isuzu','Toyota','Hyundai','Ford','Nissan'];

export default function NewVehicle() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    plateNo: '', type: '', brand: '', model: '', year: new Date().getFullYear().toString(),
    capacity: '', unit: 'كجم',
    driverName: '', status: 'available',
    lastMaintenanceDate: '', nextMaintenanceDate: '', mileage: '',
  });

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/fleet');
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة مركبة جديدة"
        description="أدخل بيانات المركبة الجديدة للأسطول"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/fleet')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="vehicle-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />{saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </>
        }
      />

      <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-5">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات المركبة</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>رقم اللوحة <span className="text-destructive">*</span></Label>
              <Input className={inputClass} placeholder="أ ب ج 1234"
                value={form.plateNo} onChange={e => set('plateNo', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>نوع المركبة <span className="text-destructive">*</span></Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                <SelectContent>{VEHICLE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>الماركة <span className="text-destructive">*</span></Label>
              <Select value={form.brand} onValueChange={v => set('brand', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر الماركة" /></SelectTrigger>
                <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>الموديل <span className="text-destructive">*</span></Label>
              <Input className={inputClass} dir="ltr" placeholder="Actros 2543"
                value={form.model} onChange={e => set('model', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>سنة الصنع <span className="text-destructive">*</span></Label>
              <Input className={inputClass} type="number" min="2000" max="2030" dir="ltr"
                value={form.year} onChange={e => set('year', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الحالة</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">متاح</SelectItem>
                  <SelectItem value="in_use">في العمل</SelectItem>
                  <SelectItem value="maintenance">صيانة</SelectItem>
                  <SelectItem value="out_of_service">خارج الخدمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>الحمولة <span className="text-destructive">*</span></Label>
              <Input className={inputClass} type="number" step="100" placeholder="10000" dir="ltr"
                value={form.capacity} onChange={e => set('capacity', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>وحدة الحمولة</Label>
              <Select value={form.unit} onValueChange={v => set('unit', v)}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="كجم">كيلوجرام</SelectItem>
                  <SelectItem value="طن">طن</SelectItem>
                  <SelectItem value="م³">متر مكعب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">السائق والصيانة</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>اسم السائق المعين</Label>
              <Input className={inputClass} placeholder="اختياري"
                value={form.driverName} onChange={e => set('driverName', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>قراءة العداد (كم)</Label>
              <Input className={inputClass} type="number" dir="ltr" placeholder="0"
                value={form.mileage} onChange={e => set('mileage', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>آخر صيانة</Label>
              <Input className={inputClass} type="date"
                value={form.lastMaintenanceDate} onChange={e => set('lastMaintenanceDate', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>الصيانة القادمة</Label>
              <Input className={inputClass} type="date"
                value={form.nextMaintenanceDate} onChange={e => set('nextMaintenanceDate', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
