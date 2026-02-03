'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // from 파라미터 포함하여 로그인 페이지로 리다이렉트
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // 로딩 중일 때 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 비로그인 상태면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!user) {
    return null;
  }

  // 로그인 상태면 children 렌더링
  return <>{children}</>;
}
