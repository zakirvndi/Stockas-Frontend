'use client'

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { apiClient } from '@/app/lib/apiClient';
import { isAuthenticated, shouldRefreshToken } from '@/utils/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated() && shouldRefreshToken()) {
          await apiClient('/auth/refresh', { method: 'POST' });
        }

        const isAuth = isAuthenticated();
        const isAuthPage = ['/login', '/register'].includes(pathname);
        const isProtectedRoute = ['/dashboard', '/transactions', '/products']
          .some(route => pathname.startsWith(route));

        if (!isAuth && isProtectedRoute) {
          router.push('/login');
        } else if (isAuth && isAuthPage) {
          router.push('/dashboard');
        }
      } catch {
        if (pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (!isAuthChecked && 
    (pathname.startsWith('/dashboard') || 
     pathname.startsWith('/transactions') || 
     pathname.startsWith('/products'))
  ) {
    return null;
  }

  return <>{children}</>;
};