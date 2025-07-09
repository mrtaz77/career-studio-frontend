import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LogIn from '../../components/LogIn';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LogIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders main elements in sign in mode', () => {
    renderWithRouter(<LogIn />);

    // Check for the heading text (will be a paragraph in this case)
    const signInHeading = screen.getAllByText('Sign In')[0]; // Get the first one (heading)
    expect(signInHeading).toBeInTheDocument();
    expect(signInHeading).toHaveClass('text-3xl', 'text-white', 'my-4');

    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('does not show name field in sign in mode', () => {
    renderWithRouter(<LogIn />);

    expect(screen.queryByPlaceholderText('Enter Name')).not.toBeInTheDocument();
  });

  test('toggles to sign up mode when clicking toggle text', () => {
    renderWithRouter(<LogIn />);

    const toggleText = screen.getByText('New to MovieGpt48 ? Sign Up');
    fireEvent.click(toggleText);

    // Check for the sign up heading
    const signUpHeading = screen.getAllByText('Sign Up')[0]; // Get the first one (heading)
    expect(signUpHeading).toBeInTheDocument();
    expect(signUpHeading).toHaveClass('text-3xl', 'text-white', 'my-4');

    expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already registered? Sign In')).toBeInTheDocument();
  });

  test('toggles back to sign in mode from sign up mode', () => {
    renderWithRouter(<LogIn />);

    // Toggle to sign up
    const toggleToSignUp = screen.getByText('New to MovieGpt48 ? Sign Up');
    fireEvent.click(toggleToSignUp);

    expect(screen.getAllByText('Sign Up')[0]).toBeInTheDocument();

    // Toggle back to sign in
    const toggleToSignIn = screen.getByText('Already registered? Sign In');
    fireEvent.click(toggleToSignIn);

    expect(screen.getAllByText('Sign In')[0]).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter Name')).not.toBeInTheDocument();
  });

  test('renders form with proper structure and styling', () => {
    renderWithRouter(<LogIn />);

    // Find the form element by its container structure
    const form = screen.getByPlaceholderText('Enter Email').closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass(
      'my-60',
      'p-12',
      'bg-black/70',
      'rounded',
      'shadow-lg',
      'bg-gradient-to-br'
    );
  });

  test('has proper input types and attributes', () => {
    renderWithRouter(<LogIn />);

    const emailInput = screen.getByPlaceholderText('Enter Email');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');

    expect(emailInput).toHaveClass('p-2', 'my-4', 'w-full', 'bg-inherit', 'text-white');
    expect(passwordInput).toHaveClass('p-2', 'my-4', 'w-full', 'bg-inherit', 'text-white');
  });

  test('shows name input with correct attributes in sign up mode', () => {
    renderWithRouter(<LogIn />);

    // Toggle to sign up
    const toggleText = screen.getByText('New to MovieGpt48 ? Sign Up');
    fireEvent.click(toggleText);

    const nameInput = screen.getByPlaceholderText('Enter Name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveClass('p-2', 'my-2', 'w-full', 'bg-inherit', 'text-white');
  });

  test('renders background container with proper styling', () => {
    renderWithRouter(<LogIn />);

    const signInHeading = screen.getAllByText('Sign In')[0];
    // Use a more specific way to find the background container
    const backgroundContainer = signInHeading.closest('div').parentElement;
    expect(backgroundContainer).toBeInTheDocument();
    expect(backgroundContainer).toHaveClass('flex', 'justify-center', 'items-center');
  });

  test('renders form container with correct layout classes', () => {
    renderWithRouter(<LogIn />);

    const signInHeading = screen.getAllByText('Sign In')[0];
    // Find the form container by traversing up the DOM
    const formContainer = signInHeading.closest('form').parentElement;
    expect(formContainer).toBeInTheDocument();
    expect(formContainer).toHaveClass('flex', 'flex-col', 'w-3/12', 'absolute');
  });

  test('prevents form submission with preventDefault', () => {
    renderWithRouter(<LogIn />);

    const form = screen.getByPlaceholderText('Enter Email').closest('form');

    // Use fireEvent.submit to test form submission behavior
    const mockPreventDefault = jest.fn();
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = mockPreventDefault;

    fireEvent.submit(form);

    expect(mockPreventDefault).toHaveBeenCalled();

    // Restore original preventDefault
    Event.prototype.preventDefault = originalPreventDefault;
  });

  test('renders "Or" text between button and toggle', () => {
    renderWithRouter(<LogIn />);

    expect(screen.getByText('Or')).toBeInTheDocument();
  });

  test('button has correct styling', () => {
    renderWithRouter(<LogIn />);

    const button = screen.getByRole('button', { name: 'Sign In' });
    expect(button).toHaveClass('bg-red-600', 'text-white', 'rounded', 'p-2', 'my-4', 'w-full');
  });

  test('error message area is present but empty initially', () => {
    renderWithRouter(<LogIn />);

    // Check that there's a paragraph with red text styling for error messages
    // Since errorMessage is null initially, we check if the error area exists but is empty
    const errorElements = document.querySelectorAll('p.text-red-500');
    expect(errorElements.length).toBeGreaterThan(0);
    const errorArea = errorElements[0];
    expect(errorArea).toHaveClass('text-red-500');
    expect(errorArea).toHaveTextContent(''); // Should be empty initially
  });

  test('maintains form state when toggling between modes', () => {
    renderWithRouter(<LogIn />);

    const emailInput = screen.getByPlaceholderText('Enter Email');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    // Enter some values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Toggle to sign up mode
    const toggleText = screen.getByText('New to MovieGpt48 ? Sign Up');
    fireEvent.click(toggleText);

    // Check that values are maintained
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();

    // Toggle back to sign in
    const toggleBackText = screen.getByText('Already registered? Sign In');
    fireEvent.click(toggleBackText);

    // Values should still be there
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
  });

  test('name input appears and disappears correctly when toggling', () => {
    renderWithRouter(<LogIn />);

    // Initially no name input
    expect(screen.queryByPlaceholderText('Enter Name')).not.toBeInTheDocument();

    // Toggle to sign up - name input should appear
    fireEvent.click(screen.getByText('New to MovieGpt48 ? Sign Up'));
    expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();

    // Toggle back to sign in - name input should disappear
    fireEvent.click(screen.getByText('Already registered? Sign In'));
    expect(screen.queryByPlaceholderText('Enter Name')).not.toBeInTheDocument();
  });

  test('renders without errors', () => {
    expect(() => renderWithRouter(<LogIn />)).not.toThrow();
  });

  test('has proper heading hierarchy', () => {
    renderWithRouter(<LogIn />);

    // The main heading should be the Sign In/Sign Up text
    const mainHeading = screen.getAllByText('Sign In')[0]; // Get the heading, not the button
    expect(mainHeading.tagName).toBe('P');
    expect(mainHeading).toHaveClass('text-3xl', 'text-white', 'my-4');
  });

  test('toggle text has proper cursor styling', () => {
    renderWithRouter(<LogIn />);

    const toggleText = screen.getByText('New to MovieGpt48 ? Sign Up');
    expect(toggleText).toHaveClass('text-white', 'cursor-pointer');
  });

  test('maintains consistent layout across mode changes', () => {
    renderWithRouter(<LogIn />);

    // Check initial layout
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Or')).toBeInTheDocument();

    // Toggle mode
    fireEvent.click(screen.getByText('New to MovieGpt48 ? Sign Up'));

    // Layout elements should still be present
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Or')).toBeInTheDocument();
  });
});
