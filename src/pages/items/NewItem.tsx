import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2, Package, Layers, Scale, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockCategories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'basic',       label: 'المعلومات الأساسية',  icon: Package },
  { id: 'inventory',   label: 'المخزون والتخزين',     icon: Layers },
  { id: 'conversions', label: 'تحويلات الوحدات',      icon: Scale },
  { id: 'advanced',    label: 'إعدادات متقدمة',       icon: Settings2 },
];

const UNITS = ['kg','gram','ton','liter','ml','piece','box','carton','bag','pallet','barrel','can'];
const UNIT_LABELS: Record<string,string> = {
  kg:'كيلوجرام', gram:'جرام', ton:'طن', liter:'لتر', ml:'ملليلتر',
  piece:'قطعة', box:'صندوق', carton:'كرتونة', bag:'كيس', pallet:'بالت', barrel:'برميل', can:'علبة'
};
const STORAGE_TYPES = [
  { value:'dry',          label:'جاف' },
  { value:'refrigerated', label:'مبرد' },
  { value:'frozen',       label:'مجمد' },
  { value:'controlled',   label:'متحكم في درجة الحرارة' },
];

interface Conv { fromUnit: string; toUnit: string; factor: string; }

export default function NewItem() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [conversions, setConversions] = useState<Conv[]>([]);
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', sku: '', barcode: '', brand: '',
    categoryId: '', subCategoryId: '',
    storageType: 'dry', baseUnit: 'kg',
    weightPerUnit: '', volumePerUnit: '', shelfLifeDays: '',
    minimumStock: '', maximumStock: '', reorderPoint: '',
    isBatchTracked: false, isSerialTracked: false,
    taxRate: '', status: 'active', notes: '',
  });

  const set = (field: string, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }));

  const addConversion = () =>
    setConversions(c => [...c, { fromUnit: 'carton', toUnit: 'kg', factor: '' }]);
  const removeConversion = (i: number) =>
    setConversions(c => c.filter((_, idx) => idx !== i));
  const updateConversion = (i: number, field: keyof Conv, value: string) =>
    setConversions(c => c.map((cv, idx) => idx === i ? { ...cv, [field]: value } : cv));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // API call would go here
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/items');
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title="إضافة صنف جديد"
        description="أدخل بيانات الصنف الجديد"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/items')}>
              <X className="h-4 w-4 ml-1.5" />إلغاء
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSubmit} disabled={saving}>
              <Save className="h-4 w-4 ml-1.5" />
              {saving ? 'جاري الحفظ...' : 'حفظ الصنف'}
            </Button>
          </>
        }
      />

      {/* Tab Nav */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                tab === t.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}>
              <Icon className="h-4 w-4" />{t.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Tab: Basic ── */}
        {tab === 'basic' && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">المعلومات الأساسية</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={fieldClass}>
                <Label>الاسم بالعربية <span className="text-destructive">*</span></Label>
                <Input className={inputClass} placeholder="مثال: أرز بسمتي هندي"
                  value={form.nameAr} onChange={e => set('nameAr', e.target.value)} required />
              </div>
              <div className={fieldClass}>
                <Label>الاسم بالإنجليزية</Label>
                <Input className={inputClass} placeholder="e.g. Indian Basmati Rice" dir="ltr"
                  value={form.nameEn} onChange={e => set('nameEn', e.target.value)} />
              </div>
              <div className={fieldClass}>
                <Label>رمز الصنف (SKU) <span className="text-destructive">*</span></Label>
                <Input className={inputClass} placeholder="GR-001" dir="ltr"
                  value={form.sku} onChange={e => set('sku', e.target.value)} required />
              </div>
              <div className={fieldClass}>
                <Label>الباركود</Label>
                <Input className={inputClass} placeholder="6281234567890" dir="ltr"
                  value={form.barcode} onChange={e => set('barcode', e.target.value)} />
              </div>
              <div className={fieldClass}>
                <Label>الفئة الرئيسية <span className="text-destructive">*</span></Label>
                <Select value={form.categoryId} onValueChange={v => set('categoryId', v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldClass}>
                <Label>الفئة الفرعية</Label>
                <Select value={form.subCategoryId} onValueChange={v => set('subCategoryId', v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="اختياري" /></SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldClass}>
                <Label>العلامة التجارية</Label>
                <Input className={inputClass} placeholder="Royal, Nido, AlMarai..."
                  value={form.brand} onChange={e => set('brand', e.target.value)} />
              </div>
              <div className={fieldClass}>
                <Label>الحالة</Label>
                <Select value={form.status} onValueChange={v => set('status', v)}>
                  <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="pending_approval">بانتظار الاعتماد</SelectItem>
                    <SelectItem value="discontinued">متوقف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Inventory ── */}
        {tab === 'inventory' && (
          <div className="space-y-5">
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">إعدادات التخزين</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={fieldClass}>
                  <Label>نوع التخزين <span className="text-destructive">*</span></Label>
                  <Select value={form.storageType} onValueChange={v => set('storageType', v)}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STORAGE_TYPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>الوحدة الأساسية <span className="text-destructive">*</span></Label>
                  <Select value={form.baseUnit} onValueChange={v => set('baseUnit', v)}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNITS.map(u => <SelectItem key={u} value={u}>{UNIT_LABELS[u]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>الوزن لكل وحدة (كجم)</Label>
                  <Input className={inputClass} type="number" step="0.001" placeholder="0.000" dir="ltr"
                    value={form.weightPerUnit} onChange={e => set('weightPerUnit', e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>الحجم لكل وحدة (لتر)</Label>
                  <Input className={inputClass} type="number" step="0.001" placeholder="0.000" dir="ltr"
                    value={form.volumePerUnit} onChange={e => set('volumePerUnit', e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>مدة الصلاحية (أيام)</Label>
                  <Input className={inputClass} type="number" placeholder="365" dir="ltr"
                    value={form.shelfLifeDays} onChange={e => set('shelfLifeDays', e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>نسبة الضريبة %</Label>
                  <Input className={inputClass} type="number" step="0.01" placeholder="15" dir="ltr"
                    value={form.taxRate} onChange={e => set('taxRate', e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">حدود المخزون</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={fieldClass}>
                  <Label>الحد الأدنى <span className="text-destructive">*</span></Label>
                  <Input className={inputClass} type="number" placeholder="500" dir="ltr"
                    value={form.minimumStock} onChange={e => set('minimumStock', e.target.value)} required />
                </div>
                <div className={fieldClass}>
                  <Label>نقطة إعادة الطلب <span className="text-destructive">*</span></Label>
                  <Input className={inputClass} type="number" placeholder="800" dir="ltr"
                    value={form.reorderPoint} onChange={e => set('reorderPoint', e.target.value)} required />
                </div>
                <div className={fieldClass}>
                  <Label>الحد الأقصى</Label>
                  <Input className={inputClass} type="number" placeholder="5000" dir="ltr"
                    value={form.maximumStock} onChange={e => set('maximumStock', e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">إعدادات التتبع</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-sm">تتبع الدفعات</p>
                    <p className="text-xs text-muted-foreground mt-0.5">تتبع المخزون بأرقام الدفعات وتواريخ الانتهاء</p>
                  </div>
                  <Switch checked={form.isBatchTracked} onCheckedChange={v => set('isBatchTracked', v)} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-sm">تتبع الأرقام التسلسلية</p>
                    <p className="text-xs text-muted-foreground mt-0.5">تتبع كل وحدة برقم تسلسلي فريد</p>
                  </div>
                  <Switch checked={form.isSerialTracked} onCheckedChange={v => set('isSerialTracked', v)} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Tab: Conversions ── */}
        {tab === 'conversions' && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">تحويلات الوحدات</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addConversion}>
                <Plus className="h-4 w-4 ml-1.5" />إضافة تحويل
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>لا توجد تحويلات وحدات بعد</p>
                  <p className="text-xs mt-1">مثال: 1 كرتونة = 25 كجم</p>
                </div>
              ) : (
                conversions.map((conv, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 items-end p-4 rounded-lg border border-border bg-muted/20">
                    <div className={fieldClass}>
                      <Label className="text-xs">من وحدة</Label>
                      <Select value={conv.fromUnit} onValueChange={v => updateConversion(i, 'fromUnit', v)}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{UNIT_LABELS[u]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="pb-1 text-muted-foreground font-medium">=</div>
                    <div className={fieldClass}>
                      <Label className="text-xs">المعامل</Label>
                      <Input className="h-9 text-xs" type="number" step="0.000001" placeholder="25" dir="ltr"
                        value={conv.factor} onChange={e => updateConversion(i, 'factor', e.target.value)} />
                    </div>
                    <div className={fieldClass}>
                      <Label className="text-xs">إلى وحدة</Label>
                      <Select value={conv.toUnit} onValueChange={v => updateConversion(i, 'toUnit', v)}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{UNIT_LABELS[u]}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => removeConversion(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Advanced ── */}
        {tab === 'advanced' && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">ملاحظات إضافية</CardTitle></CardHeader>
            <CardContent>
              <div className={fieldClass}>
                <Label>ملاحظات</Label>
                <Textarea placeholder="أي معلومات إضافية عن الصنف..." rows={5}
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/items')}>إلغاء</Button>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ الصنف'}
          </Button>
        </div>
      </form>
    </div>
  );
}
