import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileCompletionDialog } from '../../components/ProfileCompletionDialog';
import type { User } from 'firebase/auth';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:8000',
  },
  writable: true,
});

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve('mock-download-url')),
}));

// Mock toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock File API with proper type and size properties
class MockFile {
  public name: string;
  public type: string;
  public size: number;

  constructor(parts: any[], filename: string, properties?: { type?: string; size?: number }) {
    this.name = filename;
    this.type = properties?.type || 'image/jpeg';
    this.size = properties?.size || 1024;
  }
}

// Set the global File to our mock
global.File = MockFile as any;

// Mock FileReader
global.FileReader = class MockFileReader {
  result: string = 'data:image/jpeg;base64,mock-base64';
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL() {
    // Trigger onload immediately but asynchronously
    Promise.resolve().then(() => {
      if (this.onload) {
        this.onload.call(this, {} as ProgressEvent<FileReader>);
      }
    });
  }
} as any;

describe('ProfileCompletionDialog Component', () => {
  const mockCurrentUser: Partial<User> = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    getIdToken: jest.fn().mockResolvedValue('mock-token'),
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as any,
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  };

  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    currentUser: mockCurrentUser as User,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default fetch mock for profile fetching
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        username: 'testuser',
        full_name: 'Test User',
        phone: '123-456-7890',
        address: '123 Test St',
        jobTitle: 'Software Engineer',
        company: 'Test Corp',
        img: null,
      }),
    });
  });

  test('renders dialog when open is true', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    render(<ProfileCompletionDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('displays correct form fields', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Profile Picture (Optional)')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Current Job Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Current Company')).toBeInTheDocument();
      expect(document.getElementById('profilePicture')).toBeInTheDocument();
    });
  });

  test('loads and displays user profile data', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Corp')).toBeInTheDocument();
    });
  });

  test('form fields are editable', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      const usernameInput = screen.getByLabelText('Username');
      const fullNameInput = screen.getByLabelText('Full Name');
      const contactInput = screen.getByLabelText('Contact Number');
      const addressInput = screen.getByLabelText('Address');

      expect(usernameInput).not.toHaveAttribute('readonly');
      expect(fullNameInput).not.toHaveAttribute('readonly');
      expect(contactInput).not.toHaveAttribute('readonly');
      expect(addressInput).not.toHaveAttribute('readonly');
    });
  });

  test('handles form input changes', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(document.getElementById('profilePicture')).toBeInTheDocument();
    });

    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = new MockFile([''], 'profile.jpg', {
      type: 'image/jpeg',
      size: 1024, // 1KB - valid size
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Image selected',
      description: 'profile.jpg ready for upload.',
      variant: 'default',
    });
  });

  test('validates file type', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(document.getElementById('profilePicture')).toBeInTheDocument();
    });

    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = new MockFile([''], 'document.pdf', {
      type: 'application/pdf',
      size: 1024,
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invalid file type',
      description: 'Please select a JPG, PNG, GIF, or WebP image.',
      variant: 'destructive',
    });
  });

  test('validates file size limit', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(document.getElementById('profilePicture')).toBeInTheDocument();
    });

    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = new MockFile([''], 'large-image.jpg', {
      type: 'image/jpeg',
      size: 5 * 1024 * 1024, // 5MB - over the 1MB limit
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'File too large',
      description: 'Please select an image smaller than 1MB.',
      variant: 'destructive',
    });
  });

  test('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to load profile information.',
          variant: 'destructive',
        })
      );
    });
  });

  test('shows loading state during profile fetch', () => {
    // Mock a delayed response to catch loading state
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  username: 'testuser',
                  full_name: 'Test User',
                  phone: '123-456-7890',
                  address: '123 Test St',
                  jobTitle: 'Software Engineer',
                  company: 'Test Corp',
                  img: null,
                }),
              }),
            100
          )
        )
    );

    render(<ProfileCompletionDialog {...defaultProps} />);

    // Check that form fields are not pre-filled initially
    expect(screen.getByLabelText('Username')).toHaveValue('');
    expect(screen.getByLabelText('Full Name')).toHaveValue('');
  });

  test('handles missing currentUser gracefully', () => {
    render(<ProfileCompletionDialog {...defaultProps} currentUser={null} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
  });

  test('displays avatar with user initial', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    // Check that avatar shows the first letter of the name
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  test('shows file upload constraints', async () => {
    render(<ProfileCompletionDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('JPG, PNG, GIF, WebP supported')).toBeInTheDocument();
      expect(screen.getByText('Maximum file size: 1MB')).toBeInTheDocument();
    });
  });

  test('renders without errors', () => {
    expect(() => render(<ProfileCompletionDialog {...defaultProps} />)).not.toThrow();
  });
});
