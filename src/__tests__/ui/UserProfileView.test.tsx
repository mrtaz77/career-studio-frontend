import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProfileView } from '../../components/UserProfileView';

// Mock environment variable before importing component
interface GlobalWithImport {
  import: {
    meta: {
      env: {
        VITE_API_BASE_URL: string;
      };
    };
  };
}

(global as unknown as GlobalWithImport).import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000',
    },
  },
};

// Mock the auth context with a proper user
const mockUser = {
  getIdToken: jest.fn().mockResolvedValue('mock-token'),
};

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: mockUser,
  }),
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('UserProfileView', () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn();
    mockToast.mockClear();
    mockUser.getIdToken.mockClear();
  });

  test('shows loading state initially', () => {
    // Mock fetch to never resolve to test loading state
    (global as unknown as { fetch: jest.Mock }).fetch.mockImplementation(
      () => new Promise(() => {})
    );

    const { container } = render(<UserProfileView onEdit={mockOnEdit} />);

    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByText('Loading your profile...')).toBeInTheDocument();

    // Loading skeleton should be visible
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('renders user profile data correctly', async () => {
    const mockProfile = {
      username: 'johndoe',
      full_name: 'John Doe',
      email: 'john@example.com',
      img: 'https://example.com/profile.jpg',
      address: '123 Main Street, City, State',
      phone: '+1-555-123-4567',
      updated_at: '2025-01-01T12:00:00Z',
    };

    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    await act(async () => {
      render(<UserProfileView onEdit={mockOnEdit} />);
    });

    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Main Street, City, State')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', async () => {
    const mockProfile = {
      username: 'testuser',
      full_name: 'Test User',
      email: 'test@example.com',
      img: '',
      address: '123 Test St',
      phone: '+1-555-000-0000',
      updated_at: '2025-01-01T00:00:00Z',
    };

    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    await act(async () => {
      render(<UserProfileView onEdit={mockOnEdit} />);
    });

    await waitFor(
      () => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await act(async () => {
      editButton.click();
    });

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
