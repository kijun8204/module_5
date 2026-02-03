import { User, RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';

/**
 * 회원가입 API
 * POST /api/auth/register (JSON)
 */
export async function register(data: RegisterRequest): Promise<User> {
  const { passwordConfirm, ...requestData } = data;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '회원가입에 실패했습니다.');
  }

  return res.json();
}

/**
 * 로그인 API
 * POST /api/auth/login (form-urlencoded)
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '로그인에 실패했습니다.');
  }

  return res.json();
}

/**
 * 현재 사용자 정보 조회 API
 * GET /api/auth/me (Bearer 토큰)
 */
export async function getCurrentUser(token: string): Promise<User> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '사용자 정보를 가져올 수 없습니다.');
  }

  return res.json();
}

/**
 * 로그아웃 - localStorage에서 토큰 제거
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
