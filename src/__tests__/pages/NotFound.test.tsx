import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

// Mock useLocation hook
const mockLocation = {
  pathname: '/non-existent-route',
  search: '',
  hash: '',
  state: null,
  key: '',
};

const mockUseLocation = jest.fn(() => mockLocation);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

// Mock console.error to track error logging
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFound Page', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
    mockUseLocation.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('renders 404 error message', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  test('renders return to home link', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('has correct page structure and styling', () => {
    renderWithRouter(<NotFound />);

    const container = screen.getByText('404').closest('div');
    expect(container?.parentElement).toHaveClass(
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center',
      'bg-gray-100'
    );

    const textContainer = screen.getByText('404').closest('div');
    expect(textContainer).toHaveClass('text-center');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<NotFound />);

    const heading = screen.getByText('404');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-4');
    expect(heading.tagName).toBe('H1');
  });

  test('subtitle has correct styling', () => {
    renderWithRouter(<NotFound />);

    const subtitle = screen.getByText('Oops! Page not found');
    expect(subtitle).toHaveClass('text-xl', 'text-gray-600', 'mb-4');
    expect(subtitle.tagName).toBe('P');
  });

  test('home link has correct styling', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toHaveClass('text-blue-500', 'hover:text-blue-700', 'underline');
  });

  test('logs error to console on mount', () => {
    renderWithRouter(<NotFound />);

    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/non-existent-route'
    );
  });

  test('logs error with different pathname', () => {
    // Change the mock pathname
    mockUseLocation.mockReturnValue({
      ...mockLocation,
      pathname: '/another-missing-page',
    });

    renderWithRouter(<NotFound />);

    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/another-missing-page'
    );
  });

  test('renders correctly with no pathname', () => {
    mockUseLocation.mockReturnValue({
      ...mockLocation,
      pathname: '',
    });

    renderWithRouter(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      ''
    );
  });

  test('component unmounts without errors', () => {
    const { unmount } = renderWithRouter(<NotFound />);

    expect(() => unmount()).not.toThrow();
  });

  test('renders accessible content', () => {
    renderWithRouter(<NotFound />);

    // Check that important content is accessible
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
