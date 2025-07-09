import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import Index from '../../pages/Index';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

// Mock Firebase
jest.mock('../../lib/firebase', () => ({
  auth: {},
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock authSlice
import { createSlice } from '@reduxjs/toolkit';

const mockAuthSlice = createSlice({
  name: 'authenticate',
  initialState: { user: null },
  reducers: {
    addUser: (state: any, action: any) => {
      state.user = action.payload;
    },
    removeUser: (state: any) => {
      state.user = null;
    },
  },
});

// Mock components
jest.mock('@/components/Navbar', () => {
  return function MockNavbar({
    openAuthDialog,
  }: {
    openAuthDialog: (mode: 'login' | 'signup') => void;
  }) {
    return (
      <nav data-testid="navbar">
        <button onClick={() => openAuthDialog('login')}>Login</button>
        <button onClick={() => openAuthDialog('signup')}>Sign Up</button>
      </nav>
    );
  };
});

jest.mock('@/components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero">Hero Section</div>;
  };
});

jest.mock('@/components/Features', () => {
  return function MockFeatures() {
    return <div data-testid="features">Features Section</div>;
  };
});

jest.mock('@/components/Testimonials', () => {
  return function MockTestimonials() {
    return <div data-testid="testimonials">Testimonials Section</div>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Section</div>;
  };
});

jest.mock('@/components/AuthForm', () => {
  return function MockAuthForm({
    mode,
    onToggleMode,
    onSuccess,
  }: {
    mode: 'login' | 'signup';
    onToggleMode: () => void;
    onSuccess: () => void;
  }) {
    return (
      <div data-testid="auth-form">
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <button onClick={onToggleMode}>Toggle Mode</button>
        <button onClick={onSuccess}>Success</button>
      </div>
    );
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      authenticate: mockAuthSlice.reducer,
    },
    preloadedState: {
      authenticate: { user: null },
      ...initialState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Index Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      // Mock unsubscribe function
      return jest.fn();
    });
  });

  test('renders all main sections', () => {
    renderWithProviders(<Index />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('opens login dialog when clicking login', () => {
    renderWithProviders(<Index />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    // Check for the dialog header specifically
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('opens signup dialog when clicking signup', () => {
    renderWithProviders(<Index />);

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    // Check for the dialog header specifically by looking within the dialog
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toHaveTextContent('Sign Up');
  });

  test('can toggle between login and signup modes', () => {
    renderWithProviders(<Index />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // Check the auth form content instead of looking for text globally
    expect(screen.getByTestId('auth-form')).toHaveTextContent('Login');

    const toggleButton = screen.getByRole('button', { name: /toggle mode/i });
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('auth-form')).toHaveTextContent('Sign Up');
  });

  test('closes auth dialog on success', () => {
    renderWithProviders(<Index />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();

    const successButton = screen.getByRole('button', { name: /success/i });
    fireEvent.click(successButton);

    expect(screen.queryByTestId('auth-form')).not.toBeInTheDocument();
  });

  test('handles user authentication state changes', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      // Simulate user sign in
      setTimeout(() => callback(mockUser), 100);
      return jest.fn();
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles user sign out', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      // Simulate user sign out
      setTimeout(() => callback(null), 100);
      return jest.fn();
    });

    renderWithProviders(<Index />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('renders with correct page structure', () => {
    renderWithProviders(<Index />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-grow');

    const pageContainer = screen.getByTestId('navbar').closest('div');
    expect(pageContainer).toHaveClass('min-h-screen', 'flex', 'flex-col');
  });

  test('dialog opens and closes correctly', () => {
    renderWithProviders(<Index />);

    // Dialog should not be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open dialog
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close dialog by clicking outside or ESC (dialog component behavior)
    // Since we're using a mock dialog, we'll test the onSuccess callback
    const successButton = screen.getByRole('button', { name: /success/i });
    fireEvent.click(successButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
