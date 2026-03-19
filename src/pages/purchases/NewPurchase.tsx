import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockSuppliers, mockWarehouses, mockItems } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

const UNITS = ['kg','piece','box','carton','bag','pallet','liter','ton'];
const UNIT_LABELS: Record<string,string> = { kg:'كجم', piece:'قطعة', box:'صندوق', carton:'كرتونة', bag:'كيس', pallet:'بالت', liter:'لتر', ton:'طن' };

interface Line { itemId: string; itemName: string; itemSku: string; orderedQty: string; unit: string; unitPrice: string; taxRate: string; }

const emptyLine = (): Line => ({ itemId: '', itemName: '', itemSku: '', orderedQty: '', unit: 'kg', unitPrice: '', taxRate: '15' });

function calcLine(l: Line) {
  const qty = parseFloat(l.orderedQty) || 0;
  const price = parseFloat(l.unitPrice) || 0;
  const tax = parseFloat(l.taxRate) || 0;
  const sub = qty * price;
  return { sub, tax: sub * (tax / 100), total: sub + sub * (tax / 100) };
}

export default function NewPurchase() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [lines, setLines] = useState<Line[]>([emptyLine()]);
  const [form, setForm] = useState({
    supplierId: '', warehouseId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '', notes: '',
  });

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const setLine = (i: number, f: keyof Line, v: string) =>
    setLines(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, [f]: v };
      if (f === 'itemId') {
        const item = mockItems.find(it => it.id === v);
        updated.itemName = item?.nameAr || '';
        updated.itemSku = item?.sku || '';
        updated.unit = item?.baseUnit || 'kg';
      }
      return updated;
    }));

  const totals = lines.reduce((acc, l) => {
    const c = calcLine(l);
    return { sub: acc.sub + c.sub, tax: acc.tax + c.tax, grand: acc.grand + c.total };
  }, { sub: 0, tax: 0, grand: 0 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    navigate('/purchases');
  }

  const fieldClass = "space-y-1.5";

  return (
    <div className="space-y-6">
      <PageHeader
        title="أمر شراء جديد"
        description="أنشئ أمر شراء جديد من المورد"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/purchases')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              form="po-form" type="submit" disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />{saving ? 'جاري الحفظ...' : 'حفظ الأمر'}
            </Button>
          </>
        }
      />

      <form id="po-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Header */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">بيانات الأمر</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className={fieldClass + " md:col-span-2"}>
              <Label>المورد <span className="text-destructive">*</span></Label>
              <Select value={form.supplierId} onValueChange={v => set('supplierId', v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="اختر المورد" /></SelectTrigger>
                <SelectContent>
                  {mockSuppliers.filter(s => s.isActive).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass + " md:col-span-2"}>
              <Label>مستودع الاستلام <span className="text-destructive">*</span></Label>
              <Select value={form.warehouseId} onValueChange={v => set('warehouseId', v)}>
                <SelectTrigger className="h-10"><SelectValue placeholder="اختر المستودع" /></SelectTrigger>
                <SelectContent>
                  {mockWarehouses.filter(w => w.isActive).map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label>تاريخ الأمر <span className="text-destructive">*</span></Label>
              <Input className="h-10" type="date" value={form.orderDate}
                onChange={e => set('orderDate', e.target.value)} required />
            </div>
            <div className={fieldClass}>
              <Label>تاريخ التسليم المتوقع</Label>
              <Input className="h-10" type="date" value={form.expectedDate}
                onChange={e => set('expectedDate', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Lines */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">الأصناف</CardTitle>
            <Button type="button" size="sm" variant="outline"
              onClick={() => setLines(l => [...l, emptyLine()])}>
              <Plus className="h-4 w-4 ml-1.5" />إضافة صنف
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['الصنف','الكمية','الوحدة','سعر الوحدة','الضريبة %','الإجمالي',''].map(h => (
                      <th key={h} className="text-right py-2.5 px-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, i) => {
                    const calc = calcLine(line);
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 px-2 min-w-[180px]">
                          <Select value={line.itemId} onValueChange={v => setLine(i, 'itemId', v)}>
                            <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="اختر صنف" /></SelectTrigger>
                            <SelectContent>
                              {mockItems.filter(it => it.status === 'active').map(it => (
                                <SelectItem key={it.id} value={it.id}>{it.nameAr}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-2 w-24">
                          <Input className="h-9 text-xs" type="number" step="0.001" placeholder="0" dir="ltr"
                            value={line.orderedQty} onChange={e => setLine(i, 'orderedQty', e.target.value)} />
                        </td>
                        <td className="py-2 px-2 w-28">
                          <Select value={line.unit} onValueChange={v => setLine(i, 'unit', v)}>
                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {UNITS.map(u => <SelectItem key={u} value={u}>{UNIT_LABELS[u]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-2 w-28">
                          <Input className="h-9 text-xs" type="number" step="0.01" placeholder="0.00" dir="ltr"
                            value={line.unitPrice} onChange={e => setLine(i, 'unitPrice', e.target.value)} />
                        </td>
                        <td className="py-2 px-2 w-20">
                          <Input className="h-9 text-xs" type="number" step="0.01" max="100" dir="ltr"
                            value={line.taxRate} onChange={e => setLine(i, 'taxRate', e.target.value)} />
                        </td>
                        <td className="py-2 px-3 w-28 text-right font-medium tabular-nums">
                          {formatCurrency(calc.total)}
                        </td>
                        <td className="py-2 px-2 w-10">
                          {lines.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive"
                              onClick={() => setLines(l => l.filter((_, idx) => idx !== i))}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span className="tabular-nums">{formatCurrency(totals.sub)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الضريبة</span>
                  <span className="tabular-nums">{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                  <span>الإجمالي</span>
                  <span className="tabular-nums text-accent">{formatCurrency(totals.grand)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className={fieldClass}>
              <Label>ملاحظات</Label>
              <Textarea placeholder="شروط التسليم، تعليمات خاصة..." rows={3}
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
