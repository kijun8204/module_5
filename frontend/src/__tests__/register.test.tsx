import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '@/app/register/page';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/lib/api/auth', () => ({
  register: jest.fn(),
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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByLabelText(/사용자명/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/사용자명/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^비밀번호$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    const loginLink = screen.getByRole('link', { name: /로그인/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('shows error when passwords do not match', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/사용자명/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^비밀번호$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'different' },
    });

    const submitButton = screen.getByRole('button', { name: /회원가입/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument();
  });

  it('shows error when password is less than 8 characters', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/사용자명/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^비밀번호$/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'short' },
    });

    const submitButton = screen.getByRole('button', { name: /회원가입/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/비밀번호는 최소 8자 이상이어야 합니다/i)).toBeInTheDocument();
  });

  it('allows user to type in all form fields', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText(/사용자명/i);
    const emailInput = screen.getByLabelText(/이메일/i);
    const passwordInput = screen.getByLabelText(/^비밀번호$/i);
    const passwordConfirmInput = screen.getByLabelText(/비밀번호 확인/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(passwordConfirmInput).toHaveValue('password123');
  });
});
