import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
  logout: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders login form', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByLabelText(/사용자명/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: /로그인/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('has link to register page', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const registerLink = screen.getByRole('link', { name: /회원가입/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('allows user to type in username and password fields', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText(/사용자명/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });
});
