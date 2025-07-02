import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';

// Mock the auth context
const mockLogin = jest.fn();
const mockSignup = jest.fn();
const mockLoginWithGoogle = jest.fn();

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    signup: mockSignup,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithFacebook: jest.fn(),
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AuthForm', () => {
  const mockOnToggleMode = jest.fn();
  const mockOnSuccess = jest.fn();

  const renderAuthForm = (mode: 'login' | 'signup') => {
    return render(
      <BrowserRouter>
        <AuthForm mode={mode} onToggleMode={mockOnToggleMode} onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Mode', () => {
    test('renders login form correctly', () => {
      renderAuthForm('login');

      expect(screen.getByText('Log in to your account')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();

      // Get the submit button specifically (the one with type="submit")
      const submitButton = screen.getByRole('button', { name: 'Sign in' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');

      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();

      // Should NOT show name field in login mode
      expect(screen.queryByLabelText('User Name')).not.toBeInTheDocument();
    });

    test('handles login form submission', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      renderAuthForm('login');

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign in' });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
      });

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    test('handles Google login', async () => {
      mockLoginWithGoogle.mockResolvedValueOnce(undefined);
      renderAuthForm('login');

      const googleButton = screen.getByRole('button', { name: /sign in with google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      expect(mockLoginWithGoogle).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    test('shows loading state during login', async () => {
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      renderAuthForm('login');

      // Fill out the form fields first
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: 'Sign in' });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
      });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Wait for the loading state to appear
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe('Signup Mode', () => {
    test('renders signup form correctly', () => {
      renderAuthForm('signup');

      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByLabelText('User Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('handles signup form submission', async () => {
      mockSignup.mockResolvedValueOnce(undefined);
      renderAuthForm('signup');

      const nameInput = screen.getByLabelText('User Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
      });

      expect(mockSignup).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
      expect(mockOnToggleMode).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    test('validates required fields', async () => {
      renderAuthForm('signup');

      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Should not call signup if fields are empty
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('handles login error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLogin.mockRejectedValueOnce(new Error('Login failed'));

      renderAuthForm('login');

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Sign in' });

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Authentication error:', expect.any(Error));
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('handles Google login error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLoginWithGoogle.mockRejectedValueOnce(new Error('Google login failed'));

      renderAuthForm('login');

      const googleButton = screen.getByRole('button', { name: /sign in with google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Google authentication error:', expect.any(Error));
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
