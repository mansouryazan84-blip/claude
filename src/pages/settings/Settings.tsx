import { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette, Globe, Database, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'company',       label: 'بيانات الشركة',     icon: Building2 },
  { id: 'profile',       label: 'الملف الشخصي',      icon: User },
  { id: 'notifications', label: 'الإشعارات',          icon: Bell },
  { id: 'security',      label: 'الأمان',             icon: Shield },
  { id: 'appearance',    label: 'المظهر والعرض',     icon: Palette },
  { id: 'localization',  label: 'اللغة والتوطين',    icon: Globe },
  { id: 'system',        label: 'إعدادات النظام',    icon: Database },
];

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string;
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('company');
  const [saved, setSaved] = useState(false);

  // Company state
  const [company, setCompany] = useState({
    nameAr: 'شركة الخليج للأغذية', nameEn: 'Gulf Foods Company',
    taxNumber: '300123456700003', phone: '+966501234567',
    email: 'info@gulffood.sa', address: 'الرياض، حي العليا',
    website: 'www.gulffood.sa', currency: 'SAR', fiscalYearStart: '01-01',
  });

  // Profile state
  const [profile, setProfile] = useState({
    name: 'مدير النظام', email: 'admin@wms.sa',
    phone: '', currentPassword: '', newPassword: '', confirmPassword: '',
  });

  // Notifications state
  const [notif, setNotif] = useState({
    emailLowStock: true, emailTransfers: true, emailOrders: false,
    browserLowStock: true, browserTransfers: true, browserOrders: true,
    smsLowStock: false, smsTransfers: false,
    lowStockThreshold: '10',
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: 'system', density: 'comfortable', primaryColor: 'green',
    sidebarCollapsed: false, showAnimations: true,
  });

  // Localization state
  const [locale, setLocale] = useState({
    language: 'ar', direction: 'rtl', dateFormat: 'DD/MM/YYYY',
    timeFormat: '12', timezone: 'Asia/Riyadh', numberFormat: 'ar-SA',
  });

  // System state
  const [system, setSystem] = useState({
    sessionTimeout: '60', maxLoginAttempts: '5', requireMFA: false,
    auditLog: true, autoBackup: true, backupFrequency: 'daily',
    maintenanceMode: false,
  });

  async function handleSave() {
    setSaved(true);
    await new Promise(r => setTimeout(r, 800));
    setSaved(false);
  }

  const fieldClass = "space-y-1.5";
  const inputClass = "h-10";

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="إدارة إعدادات النظام والتفضيلات"
        actions={
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleSave} disabled={saved}>
            <Save className="h-4 w-4 ml-1.5" />
            {saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
          </Button>
        }
      />

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-right',
                    activeSection === s.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── Company ── */}
          {activeSection === 'company' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">بيانات الشركة</CardTitle>
                <CardDescription>المعلومات الأساسية التي تظهر في التقارير والفواتير</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={fieldClass}>
                  <Label>اسم الشركة بالعربية</Label>
                  <Input className={inputClass} value={company.nameAr}
                    onChange={e => setCompany(c => ({ ...c, nameAr: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>Company Name (English)</Label>
                  <Input className={inputClass} dir="ltr" value={company.nameEn}
                    onChange={e => setCompany(c => ({ ...c, nameEn: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>الرقم الضريبي</Label>
                  <Input className={inputClass} dir="ltr" value={company.taxNumber}
                    onChange={e => setCompany(c => ({ ...c, taxNumber: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>رقم الهاتف</Label>
                  <Input className={inputClass} dir="ltr" value={company.phone}
                    onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>البريد الإلكتروني</Label>
                  <Input className={inputClass} dir="ltr" type="email" value={company.email}
                    onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>الموقع الإلكتروني</Label>
                  <Input className={inputClass} dir="ltr" value={company.website}
                    onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} />
                </div>
                <div className={fieldClass + " md:col-span-2"}>
                  <Label>العنوان</Label>
                  <Textarea value={company.address} rows={2}
                    onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
                </div>
                <div className={fieldClass}>
                  <Label>العملة الافتراضية</Label>
                  <Select value={company.currency} onValueChange={v => setCompany(c => ({ ...c, currency: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Profile ── */}
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">المعلومات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={fieldClass}>
                    <Label>الاسم</Label>
                    <Input className={inputClass} value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className={fieldClass}>
                    <Label>البريد الإلكتروني</Label>
                    <Input className={inputClass} dir="ltr" type="email" value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className={fieldClass}>
                    <Label>رقم الهاتف</Label>
                    <Input className={inputClass} dir="ltr" type="tel" placeholder="+966..."
                      value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">تغيير كلمة المرور</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={fieldClass + " md:col-span-2"}>
                    <Label>كلمة المرور الحالية</Label>
                    <Input className={inputClass} type="password" placeholder="••••••••"
                      value={profile.currentPassword}
                      onChange={e => setProfile(p => ({ ...p, currentPassword: e.target.value }))} />
                  </div>
                  <div className={fieldClass}>
                    <Label>كلمة المرور الجديدة</Label>
                    <Input className={inputClass} type="password" placeholder="••••••••"
                      value={profile.newPassword}
                      onChange={e => setProfile(p => ({ ...p, newPassword: e.target.value }))} />
                  </div>
                  <div className={fieldClass}>
                    <Label>تأكيد كلمة المرور</Label>
                    <Input className={inputClass} type="password" placeholder="••••••••"
                      value={profile.confirmPassword}
                      onChange={e => setProfile(p => ({ ...p, confirmPassword: e.target.value }))} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">إشعارات البريد الإلكتروني</CardTitle></CardHeader>
                <CardContent className="divide-y divide-border">
                  <ToggleRow label="تنبيه نفاد المخزون" description="عند وصول صنف للحد الأدنى"
                    checked={notif.emailLowStock} onChange={v => setNotif(n => ({ ...n, emailLowStock: v }))} />
                  <ToggleRow label="تحديثات المناقلات" description="عند تغيير حالة طلب مناقلة"
                    checked={notif.emailTransfers} onChange={v => setNotif(n => ({ ...n, emailTransfers: v }))} />
                  <ToggleRow label="أوامر الشراء والبيع" description="عند إنشاء أو اعتماد أوامر"
                    checked={notif.emailOrders} onChange={v => setNotif(n => ({ ...n, emailOrders: v }))} />
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">إشعارات المتصفح</CardTitle></CardHeader>
                <CardContent className="divide-y divide-border">
                  <ToggleRow label="تنبيه نفاد المخزون" checked={notif.browserLowStock}
                    onChange={v => setNotif(n => ({ ...n, browserLowStock: v }))} />
                  <ToggleRow label="تحديثات المناقلات" checked={notif.browserTransfers}
                    onChange={v => setNotif(n => ({ ...n, browserTransfers: v }))} />
                  <ToggleRow label="أوامر الشراء والبيع" checked={notif.browserOrders}
                    onChange={v => setNotif(n => ({ ...n, browserOrders: v }))} />
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">حد التنبيه</CardTitle></CardHeader>
                <CardContent>
                  <div className={fieldClass + " max-w-xs"}>
                    <Label>نسبة المخزون الحرج %</Label>
                    <Input className={inputClass} type="number" min="1" max="50" dir="ltr"
                      value={notif.lowStockThreshold}
                      onChange={e => setNotif(n => ({ ...n, lowStockThreshold: e.target.value }))} />
                    <p className="text-xs text-muted-foreground">تنبيه عند وصول المخزون لهذه النسبة من الحد الأدنى</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeSection === 'appearance' && (
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">المظهر والعرض</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className={fieldClass}>
                  <Label>المظهر</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { value: 'light', label: 'فاتح', bg: 'bg-white border-2' },
                      { value: 'dark',  label: 'داكن', bg: 'bg-gray-900 border-2' },
                      { value: 'system',label: 'تلقائي', bg: 'bg-gradient-to-br from-white to-gray-900 border-2' },
                    ].map(t => (
                      <button key={t.value} type="button"
                        onClick={() => setAppearance(a => ({ ...a, theme: t.value }))}
                        className={cn(
                          'rounded-lg p-3 text-center transition-all',
                          t.bg,
                          appearance.theme === t.value ? 'border-accent ring-2 ring-accent/30' : 'border-border'
                        )}>
                        <div className={cn('h-10 w-full rounded mb-2', t.bg)} />
                        <span className="text-xs font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="divide-y divide-border">
                  <ToggleRow label="تصغير الشريط الجانبي تلقائياً"
                    checked={appearance.sidebarCollapsed}
                    onChange={v => setAppearance(a => ({ ...a, sidebarCollapsed: v }))} />
                  <ToggleRow label="تفعيل الحركات والتأثيرات"
                    description="تعطيل للحصول على أداء أفضل"
                    checked={appearance.showAnimations}
                    onChange={v => setAppearance(a => ({ ...a, showAnimations: v }))} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Localization ── */}
          {activeSection === 'localization' && (
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base">اللغة والتوطين</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={fieldClass}>
                  <Label>اللغة</Label>
                  <Select value={locale.language} onValueChange={v => setLocale(l => ({ ...l, language: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>المنطقة الزمنية</Label>
                  <Select value={locale.timezone} onValueChange={v => setLocale(l => ({ ...l, timezone: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">الرياض (UTC+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (UTC+4)</SelectItem>
                      <SelectItem value="Africa/Cairo">القاهرة (UTC+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>تنسيق التاريخ</Label>
                  <Select value={locale.dateFormat} onValueChange={v => setLocale(l => ({ ...l, dateFormat: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>تنسيق الوقت</Label>
                  <Select value={locale.timeFormat} onValueChange={v => setLocale(l => ({ ...l, timeFormat: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 ساعة (AM/PM)</SelectItem>
                      <SelectItem value="24">24 ساعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Security ── */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">إعدادات الجلسة</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={fieldClass}>
                    <Label>انتهاء الجلسة (دقيقة)</Label>
                    <Select value={system.sessionTimeout} onValueChange={v => setSystem(s => ({ ...s, sessionTimeout: v }))}>
                      <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['15','30','60','120','480'].map(v => (
                          <SelectItem key={v} value={v}>{v} دقيقة</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label>الحد الأقصى لمحاولات الدخول</Label>
                    <Select value={system.maxLoginAttempts} onValueChange={v => setSystem(s => ({ ...s, maxLoginAttempts: v }))}>
                      <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['3','5','10'].map(v => <SelectItem key={v} value={v}>{v} محاولات</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">خيارات الأمان</CardTitle></CardHeader>
                <CardContent className="divide-y divide-border">
                  <ToggleRow label="المصادقة الثنائية (MFA)"
                    description="يتطلب رمزاً إضافياً عند تسجيل الدخول"
                    checked={system.requireMFA}
                    onChange={v => setSystem(s => ({ ...s, requireMFA: v }))} />
                  <ToggleRow label="سجل التدقيق التفصيلي"
                    description="تسجيل جميع الإجراءات في سجل مفصل"
                    checked={system.auditLog}
                    onChange={v => setSystem(s => ({ ...s, auditLog: v }))} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── System ── */}
          {activeSection === 'system' && (
            <div className="space-y-5">
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">النسخ الاحتياطي</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="divide-y divide-border">
                    <ToggleRow label="النسخ الاحتياطي التلقائي"
                      checked={system.autoBackup}
                      onChange={v => setSystem(s => ({ ...s, autoBackup: v }))} />
                  </div>
                  {system.autoBackup && (
                    <div className={fieldClass + " max-w-xs"}>
                      <Label>تكرار النسخ الاحتياطي</Label>
                      <Select value={system.backupFrequency} onValueChange={v => setSystem(s => ({ ...s, backupFrequency: v }))}>
                        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">كل ساعة</SelectItem>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="glass-card border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">منطقة الخطر</CardTitle>
                  <CardDescription>هذه الإعدادات تؤثر على النظام بأكمله</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div>
                      <p className="font-medium text-sm">وضع الصيانة</p>
                      <p className="text-xs text-muted-foreground mt-0.5">يمنع جميع المستخدمين من الوصول إلى النظام</p>
                    </div>
                    <Switch checked={system.maintenanceMode}
                      onCheckedChange={v => setSystem(s => ({ ...s, maintenanceMode: v }))} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
