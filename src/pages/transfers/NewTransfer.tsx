import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockWarehouses, mockItems } from '@/lib/mock-data';

const UNITS = ['kg','gram','ton','liter','ml','piece','box','carton','bag','pallet'];
const UNIT_LABELS: Record<string,string> = {
  kg:'كيلوجرام', gram:'جرام', ton:'طن', liter:'لتر', ml:'ملليلتر',
  piece:'قطعة', box:'صندوق', carton:'كرتونة', bag:'كيس', pallet:'بالت'
};

export default function NewTransfer() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    itemId: '', fromWarehouseId: '', toWarehouseId: '',
    quantity: '', unit: 'kg',
    driverName: '', vehicleNo: '', notes: '',
  });

  const set = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/transfers');
  }

  const fieldClass = "space-y-1.5";
  const selectedItem = mockItems.find(i => i.id === form.itemId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="طلب مناقلة جديد"
        description="أنشئ طلب نقل بضاعة بين المستودعات"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/transfers')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="transfer-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />
              {saving ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </>
        }
      />

      <form id="transfer-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Item & Quantity */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات الصنف</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass + " md:col-span-2"}>
              <Label>الصنف <span className="text-destructive">*</span></Label>
              <Select value={form.itemId} onValueChange={v => set('itemId', v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="اختر الصنف" /></SelectTrigger>
                <SelectContent>
                  {mockItems.filter(i => i.status === 'active').map(i => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.nameAr} — {i.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  الرصيد الحالي: {(selectedItem.currentStock ?? 0).toLocaleString('ar-SA')} {selectedItem.baseUnit}
                </p>
              )}
            </div>
            <div className={fieldClass}>
              <Label>الكمية <span className="text-destructive">*</span></Label>
              <Input className="h-10" type="number" step="0.001" placeholder="500" dir="ltr"
                value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>الوحدة <span className="text-destructive">*</span></Label>
              <Select value={form.unit} onValueChange={v => set('unit', v)}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNITS.map(u => <SelectItem key={u} value={u}>{UNIT_LABELS[u]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Warehouses */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />مسار النقل
          </CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>من مستودع <span className="text-destructive">*</span></Label>
              <Select value={form.fromWarehouseId} onValueChange={v => set('fromWarehouseId', v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="المستودع المصدر" /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.filter(w => w.isActive && w.id !== form.toWarehouseId).map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>إلى مستودع <span className="text-destructive">*</span></Label>
              <Select value={form.toWarehouseId} onValueChange={v => set('toWarehouseId', v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="المستودع الوجهة" /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.filter(w => w.isActive && w.id !== form.fromWarehouseId).map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Driver */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات الشحن (اختياري)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={fieldClass}>
              <Label>اسم السائق</Label>
              <Input className="h-10" placeholder="أحمد محمد"
                value={form.driverName} onChange={e => set('driverName', e.target.value)} />
            </div>
            <div className={fieldClass}>
              <Label>رقم المركبة</Label>
              <Input className="h-10" placeholder="أ ب ج 1234"
                value={form.vehicleNo} onChange={e => set('vehicleNo', e.target.value)} />
            </div>
            <div className={fieldClass + " md:col-span-2"}>
              <Label>ملاحظات</Label>
              <Textarea placeholder="أي تفاصيل إضافية..." rows={3}
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
