import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Warehouse, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await resetPassword(email);
    setIsLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error ?? 'حدث خطأ غير متوقع');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-sidebar flex items-center justify-center">
            <Warehouse className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">نظام المستودعات</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">تم إرسال الرابط</h2>
            <p className="text-sm text-muted-foreground mb-6">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى {email}
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">العودة لتسجيل الدخول</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">نسيت كلمة المرور؟</h2>
              <p className="text-sm text-muted-foreground mt-1">
                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 ml-2 animate-spin" />جاري الإرسال...</>
                ) : (
                  'إرسال رابط إعادة التعيين'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              تذكرت كلمة المرور؟{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
