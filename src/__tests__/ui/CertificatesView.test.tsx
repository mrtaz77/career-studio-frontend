import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:8000',
  },
  writable: true,
});

// Mocks for Auth and Toast hooks
const mockToast = jest.fn();
const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { getIdToken: mockGetIdToken },
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Component under test
import { CertificatesView } from '../../components/CertificatesView';

// Mock fetch globally
global.fetch = jest.fn();

describe('CertificatesView', () => {
  const renderWithClient = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return render(
      <QueryClientProvider client={queryClient}>
        <CertificatesView />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();
    mockGetIdToken.mockResolvedValue('mock-token');
  });

  test('renders certificates view', async () => {
    // Mock successful fetch with empty array
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      renderWithClient();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Certificates')).toBeInTheDocument();
    });
  });

  test('displays loading initially', async () => {
    // Mock delayed response
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => [],
              }),
            100
          )
        )
    );

    await act(async () => {
      renderWithClient();
    });

    // Should show loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays certificates after successful fetch', async () => {
    const mockCertificates = [
      {
        id: '1',
        title: 'Test Certificate',
        issuer: 'Test Issuer',
        issued_date: '2023-01-01',
        link: 'https://example.com/cert.pdf',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCertificates,
    });

    await act(async () => {
      renderWithClient();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Certificate')).toBeInTheDocument();
      expect(screen.getByText('Test Issuer')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      renderWithClient();
    });

    await waitFor(() => {
      expect(screen.getByText('Certificates')).toBeInTheDocument();
    });
  });

  test('opens add dialog when add button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      renderWithClient();
    });

    await waitFor(() => {
      expect(screen.getByText('Certificates')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Certificate(s)');

    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('renders without crashing', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      expect(() => renderWithClient()).not.toThrow();
    });
  });
});
