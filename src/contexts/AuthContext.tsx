import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { User, AuthState } from '@/types';
import { authApi, ApiError } from '@/api/client';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'wms_user',
  TOKEN: 'wms_token',
} as const;

function persistSession(user: User, token: string) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
    }
    if (password.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }
    try {
      const data = await authApi.login(email, password);
      setUser(data.user as User);
      setToken(data.token);
      persistSession(data.user as User, data.token);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'حدث خطأ أثناء تسجيل الدخول';
      return { success: false, error: message };
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: 'يرجى ملء جميع الحقول المطلوبة' };
    }
    if (password.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }
    try {
      const data = await authApi.register({ name, email, password });
      setUser(data.user as User);
      setToken(data.token);
      persistSession(data.user as User, data.token);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'حدث خطأ أثناء إنشاء الحساب';
      return { success: false, error: message };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email.trim()) {
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني' };
    }
    try {
      await authApi.forgotPassword(email);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
      return { success: false, error: message };
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
