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

const CITIES = ['الرياض','جدة','الدمام','المدينة المنورة','مكة المكرمة','الطائف','أبها','تبوك','القصيم','حائل'];

interface Props { type: 'supplier' | 'customer'; }

export default function NewContact({ type }: Props) {
  const navigate = useNavigate();
  const backPath = type === 'supplier' ? '/suppliers' : '/customers';
  const title = type === 'supplier' ? 'إضافة مورد جديد' : 'إضافة عميل جديد';
  const desc = type === 'supplier' ? 'أدخل بيانات المورد الجديد' : 'أدخل بيانات العميل الجديد';

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', code: '',
    phone: '', email: '',
    address: '', city: '',
    taxNumber: '', creditLimit: '', paymentTerms: '30',
    isActive: true, notes: '',
  });

  const set = (f: string, v: unknown) => setForm(p => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate(backPath);
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={desc}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate(backPath)}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="contact-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />{saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </>
        }
      />

      <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Identity */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">البيانات الأساسية</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>الاسم بالعربية <span className="text-destructive">*</span></Label>
              <Input className={inputClass} placeholder="شركة / مؤسسة / فرد"
                value={form.nameAr} onChange={e => set('nameAr', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الاسم بالإنجليزية</Label>
              <Input className={inputClass} dir="ltr" placeholder="Company / Person name"
                value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>الرمز <span className="text-destructive">*</span></Label>
              <Input className={inputClass} dir="ltr" placeholder={type === 'supplier' ? 'SUP-001' : 'CUS-001'}
                value={form.code} onChange={e => set('code', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الرقم الضريبي</Label>
              <Input className={inputClass} dir="ltr" placeholder="300000000000003"
                value={form.taxNumber} onChange={e => set('taxNumber', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
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
              <Input className={inputClass} dir="ltr" type="email" placeholder="info@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>المدينة</Label>
              <Select value={form.city} onValueChange={v => set('city', v)}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>العنوان</Label>
              <Input className={inputClass} placeholder="الشارع، الحي"
                value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Financial */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">البيانات المالية</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={fieldClass}>
              <Label>حد الائتمان (ر.س)</Label>
              <Input className={inputClass} type="number" step="100" placeholder="100000" dir="ltr"
                value={form.creditLimit} onChange={e => set('creditLimit', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>شروط الدفع (أيام)</Label>
              <Select value={form.paymentTerms} onValueChange={v => set('paymentTerms', v)}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['0','7','14','15','30','45','60','90'].map(d => (
                    <SelectItem key={d} value={d}>{d === '0' ? 'فوري' : `${d} يوم`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>الحالة</Label>
              <div className="flex items-center gap-3 h-10">
                <Switch checked={form.isActive} onCheckedChange={v => set('isActive', v)} />
                <span className="text-sm">{form.isActive ? 'نشط' : 'موقف'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
