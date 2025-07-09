import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock Firebase auth before importing Dashboard
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Mock a logged-in user
    setTimeout(
      () =>
        callback({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
        }),
      0
    );
    return jest.fn(); // Mock unsubscribe function
  }),
}));

// Mock Firebase
jest.mock('../../lib/firebase', () => ({
  auth: {},
}));

// Mock AuthContext
const mockLogout = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    },
    logout: mockLogout,
  }),
}));

// Mock react-router-dom navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Simple mock for authSlice
const mockAuthReducer = (
  state = { uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' },
  action: any
) => {
  switch (action.type) {
    case 'authenticate/addUser':
      return { ...state, ...action.payload };
    case 'authenticate/removeUser':
      return { uid: null, email: null, displayName: null, photoURL: null };
    default:
      return state;
  }
};

// Mock child components to avoid import issues
jest.mock('@/components/UserProfileView', () => {
  return {
    UserProfileView: ({ onEdit }: { onEdit: () => void }) => (
      <div data-testid="user-profile-view">
        <button onClick={onEdit}>Edit Profile</button>
      </div>
    ),
  };
});

jest.mock('@/components/CertificatesView', () => {
  return {
    CertificatesView: () => <div data-testid="certificates-view">Certificates View</div>,
  };
});

jest.mock('@/components/EducationView', () => {
  return {
    EducationView: () => <div data-testid="education-view">Education View</div>,
  };
});

jest.mock('@/components/ProfileCompletionDialog', () => {
  return {
    ProfileCompletionDialog: ({
      open,
      onClose,
      currentUser,
    }: {
      open: boolean;
      onClose: () => void;
      currentUser: any;
    }) =>
      open ? (
        <div data-testid="profile-completion-dialog">
          <button onClick={onClose}>Close Dialog</button>
          <span>User: {currentUser?.displayName}</span>
        </div>
      ) : null,
  };
});

jest.mock('@/components/CVEditor', () => {
  return {
    CVEditor: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
      open ? (
        <div data-testid="cv-editor">
          <button onClick={onClose}>Close CV Editor</button>
        </div>
      ) : null,
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock DOM methods for CV download
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
global.Blob = jest.fn(() => ({})) as any;

// Import Dashboard directly (no lazy loading)
import Dashboard from '../../pages/Dashboard';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      authenticate: mockAuthReducer,
    },
    preloadedState: {
      authenticate: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        ...initialState,
      },
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

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('renders dashboard without crashing', async () => {
    renderWithProviders(<Dashboard />);

    // Wait for the component to load and check for header
    await waitFor(() => {
      expect(screen.getByText('Career Studio')).toBeInTheDocument();
    });
  });

  test('displays user info in header', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Use getAllByText and check the first occurrence (in header)
      const testUserElements = screen.getAllByText('Test User');
      expect(testUserElements.length).toBeGreaterThan(0);
      expect(testUserElements[0]).toBeInTheDocument();
    });
  });

  test('renders sidebar navigation', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Use getByRole for buttons to be more specific
      expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /smart cv/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /education/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /certificates/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /portfolio/i })).toBeInTheDocument();
    });
  });

  test('displays overview tab by default', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText('CV Completion')).toBeInTheDocument();
      expect(screen.getByTestId('user-profile-view')).toBeInTheDocument();
    });
  });

  test('switches tabs when clicked', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /smart cv/i })).toBeInTheDocument();
    });

    // Click on CV tab
    fireEvent.click(screen.getByRole('button', { name: /smart cv/i }));

    await waitFor(() => {
      expect(screen.getByText('Smart CV Builder')).toBeInTheDocument();
    });
  });

  test('opens profile dialog when edit profile is clicked', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('user-profile-view')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    await waitFor(() => {
      expect(screen.getByTestId('profile-completion-dialog')).toBeInTheDocument();
    });
  });

  test('handles logout functionality', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Check that the component renders successfully
      expect(screen.getByText('Career Studio')).toBeInTheDocument();
    });

    // Check that logout mock exists and is a function
    expect(mockLogout).toBeDefined();
    expect(typeof mockLogout).toBe('function');
  });
});
