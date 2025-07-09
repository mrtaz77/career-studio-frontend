import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock Date.getFullYear() to return a consistent year for testing
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2024);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders footer with correct structure', () => {
    renderWithRouter(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-violet-950', 'text-white', 'py-12');
  });

  test('displays Career Studio brand name and description', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText('Career Studio')).toBeInTheDocument();
    expect(screen.getByText(/Empowering job seekers with professional tools/)).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderWithRouter(<Footer />);

    // Check for social media icons with proper accessibility
    // These use sr-only spans, so we check by text content within links
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

    expect(facebookLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();

    // Check that they point to # (placeholder)
    expect(facebookLink).toHaveAttribute('href', '#');
    expect(twitterLink).toHaveAttribute('href', '#');
    expect(linkedinLink).toHaveAttribute('href', '#');
  });

  test('renders Features section with correct links', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText('Features')).toBeInTheDocument();

    const featuresLinks = ['CV Builder', 'Portfolio Creator', 'Job Search', 'Career Resources'];

    featuresLinks.forEach((linkText) => {
      const link = screen.getByRole('link', { name: linkText });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('text-gray-400', 'hover:text-white');
    });
  });

  test('renders Company section with correct links', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText('Company')).toBeInTheDocument();

    const companyLinks = ['About Us', 'Careers', 'Blog', 'Contact'];

    companyLinks.forEach((linkText) => {
      const link = screen.getByRole('link', { name: linkText });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('text-gray-400', 'hover:text-white');
    });
  });

  test('renders Legal section with correct links', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText('Legal')).toBeInTheDocument();

    const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

    legalLinks.forEach((linkText) => {
      const link = screen.getByRole('link', { name: linkText });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('text-gray-400', 'hover:text-white');
    });
  });

  test('displays copyright notice with current year', () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText('© 2024 Career Studio. All rights reserved.')).toBeInTheDocument();
  });

  test('has correct grid layout classes', () => {
    renderWithRouter(<Footer />);

    const gridContainer = screen.getByText('Career Studio').closest('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-8');
  });

  test('has proper responsive design classes', () => {
    renderWithRouter(<Footer />);

    const container = screen.getByText('Career Studio').closest('.container');
    expect(container).toHaveClass('container', 'mx-auto', 'px-4');
  });

  test('social media icons have proper SVG structure', () => {
    renderWithRouter(<Footer />);

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

    const facebookIcon = facebookLink.querySelector('svg');
    const twitterIcon = twitterLink.querySelector('svg');
    const linkedinIcon = linkedinLink.querySelector('svg');

    expect(facebookIcon).toBeInTheDocument();
    expect(twitterIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();

    // Check SVG classes
    [facebookIcon, twitterIcon, linkedinIcon].forEach((icon) => {
      expect(icon).toHaveClass('h-6', 'w-6');
      expect(icon).toHaveAttribute('fill', 'currentColor');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('section headings have correct styling', () => {
    renderWithRouter(<Footer />);

    const sectionHeadings = screen.getAllByRole('heading', { level: 3 });

    sectionHeadings.forEach((heading) => {
      expect(heading).toHaveClass('text-lg', 'font-semibold', 'mb-4', 'text-white');
    });

    // Check specific headings exist
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Company' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Legal' })).toBeInTheDocument();
  });

  test('main heading has correct styling', () => {
    renderWithRouter(<Footer />);

    const mainHeading = screen.getByRole('heading', { name: 'Career Studio' });
    expect(mainHeading).toHaveClass('text-2xl', 'font-display', 'font-bold', 'mb-4');
  });

  test('description text has correct styling', () => {
    renderWithRouter(<Footer />);

    const description = screen.getByText(/Empowering job seekers/);
    expect(description).toHaveClass('text-gray-400', 'mb-4');
  });

  test('copyright section has correct styling', () => {
    renderWithRouter(<Footer />);

    const copyrightSection = screen.getByText(/© 2024/).closest('div');
    expect(copyrightSection).toHaveClass(
      'border-t',
      'border-gray-800',
      'mt-12',
      'pt-6',
      'text-center',
      'text-gray-400'
    );
  });

  test('social media links container has correct styling', () => {
    renderWithRouter(<Footer />);

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const socialContainer = facebookLink.closest('.flex');
    expect(socialContainer).toHaveClass('flex', 'space-x-4');
  });

  test('all navigation sections have proper list structure', () => {
    renderWithRouter(<Footer />);

    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(3); // Features, Company, Legal

    lists.forEach((list) => {
      expect(list).toHaveClass('space-y-2');
    });
  });

  test('renders without errors', () => {
    expect(() => renderWithRouter(<Footer />)).not.toThrow();
  });

  test('accessibility: has proper heading hierarchy', () => {
    renderWithRouter(<Footer />);

    // Should have one h2 (main heading) and three h3 (section headings)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  test('accessibility: all links are properly accessible', () => {
    renderWithRouter(<Footer />);

    const allLinks = screen.getAllByRole('link');

    allLinks.forEach((link) => {
      // Each link should have either visible text or accessible name
      expect(
        link.textContent || link.getAttribute('aria-label') || link.querySelector('[aria-label]')
      ).toBeTruthy();
    });
  });
});
