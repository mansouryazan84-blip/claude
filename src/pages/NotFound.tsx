import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center">
        <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Link to="/">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Home className="h-4 w-4 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
