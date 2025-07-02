import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

  test('displays loading state initially', async () => {
    // Mock a delayed response to catch the loading state
    (global as unknown as { fetch: jest.Mock }).fetch.mockImplementation(
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

    // Check that loading text appears briefly
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test('renders list of certificates after fetch', async () => {
    const mockCerts = [
      { id: '1', title: 'Cert A', issuer: 'Issuer A', issued_date: '2025-06-30', link: 'urlA' },
    ];
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCerts,
    });

    await act(async () => {
      renderWithClient();
    });

    // Wait for element to appear
    expect(await screen.findByText('Cert A')).toBeInTheDocument();
    expect(screen.getByText('Issuer A')).toBeInTheDocument();
  });

  test('opens add dialog when clicking Add Certificate', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      renderWithClient();
    });

    const addBtn = await screen.findByRole('button', { name: /add certificate/i });

    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add Certificate(s)' })).toBeInTheDocument();
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

    await act(async () => {
      renderWithClient();
    });

    // wait and click Edit
    expect(await screen.findByText('Cert A')).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /edit/i });

    await act(async () => {
      fireEvent.click(editBtn);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Edit Certificate' })).toBeInTheDocument();
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
      .mockResolvedValueOnce({ ok: true }); // Delete response

    await act(async () => {
      renderWithClient();
    });

    expect(await screen.findByText('Cert A')).toBeInTheDocument();

    // Find the delete button - it should be the button with Trash2 icon
    const certificateCard = screen.getByText('Cert A').closest('.border');
    expect(certificateCard).toBeInTheDocument();

    // Get all buttons in the certificate card and find the one with the trash icon
    const buttons = certificateCard!.querySelectorAll('button');
    const deleteBtn = Array.from(buttons).find(
      (btn) => btn.querySelector('svg') && btn.classList.contains('text-red-600')
    );

    expect(deleteBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(deleteBtn!);
    });

    // Wait for the API call and state update
    await waitFor(() => {
      expect(screen.queryByText('Cert A')).not.toBeInTheDocument();
    });
  });
});
