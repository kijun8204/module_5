'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            환영합니다, {user?.username}님!
          </h1>
          <p className="text-gray-600 mb-6">
            이 페이지는 로그인한 사용자만 접근할 수 있습니다.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              사용자 정보
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-700">ID:</span>{' '}
                <span className="text-gray-600">{user?.id}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">사용자명:</span>{' '}
                <span className="text-gray-600">{user?.username}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">이메일:</span>{' '}
                <span className="text-gray-600">{user?.email}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">계정 상태:</span>{' '}
                <span className={user?.is_active ? 'text-green-600' : 'text-red-600'}>
                  {user?.is_active ? '활성' : '비활성'}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">가입일:</span>{' '}
                <span className="text-gray-600">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}
                </span>
              </p>
            </div>
          </div>

          {/* 빠른 메뉴 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              빠른 메뉴
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/stocks"
                className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">주식 현황</p>
                  <p className="text-xs text-gray-500">코스피 TOP 10</p>
                </div>
              </Link>
              <Link
                href="/games"
                className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">게임</p>
                  <p className="text-xs text-gray-500">오목 플레이</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
