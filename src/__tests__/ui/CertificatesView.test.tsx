import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocks for Auth and Toast hooks
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { getIdToken: async () => 'mock-token' },
  }),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// Component under test
import { CertificatesView } from '../../components/CertificatesView';

describe('CertificatesView', () => {
  const renderWithClient = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <CertificatesView />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn();
  });

  test('displays loading state initially', () => {
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    renderWithClient();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders list of certificates after fetch', async () => {
    const mockCerts = [
      { id: '1', title: 'Cert A', issuer: 'Issuer A', issued_date: '2025-06-30', link: 'urlA' },
    ];
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCerts,
    });

    renderWithClient();

    // Wait for element to appear
    expect(await screen.findByText('Cert A')).toBeInTheDocument();
    expect(screen.getByText('Issuer A')).toBeInTheDocument();
  });

  test('opens add dialog when clicking Add Certificate', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    renderWithClient();

    const addBtn = await screen.findByRole('button', { name: /add certificate/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Find the input by placeholder or other attribute since labels aren't properly connected
    const titleInputs = screen.getAllByDisplayValue('');
    expect(titleInputs.length).toBeGreaterThan(0);
  });

  test('opens edit dialog with prefilled values', async () => {
    const mockCerts = [
      { id: '1', title: 'Cert A', issuer: 'Issuer A', issued_date: '2025-06-30', link: 'urlA' },
    ];
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCerts,
    });

    renderWithClient();

    // wait and click Edit
    expect(await screen.findByText('Cert A')).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Check that the dialog has inputs with the expected values
    expect(screen.getByDisplayValue('Cert A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Issuer A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-06-30')).toBeInTheDocument();
  });

  test('calls delete API and removes item from list', async () => {
    const mockCerts = [
      { id: '1', title: 'Cert A', issuer: 'Issuer A', issued_date: '2025-06-30', link: 'urlA' },
    ];
    (global as unknown as { fetch: jest.Mock }).fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockCerts })
      .mockResolvedValueOnce({ ok: true });

    renderWithClient();

    expect(await screen.findByText('Cert A')).toBeInTheDocument();
    // Find the delete button by its icon or position (it doesn't have accessible text)
    const deleteBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText('Cert A')).not.toBeInTheDocument();
    });
  });
});
