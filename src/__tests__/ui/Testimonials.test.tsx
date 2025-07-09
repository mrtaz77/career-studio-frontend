import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Testimonials from '../../components/Testimonials';

describe('Testimonials Component', () => {
  test('renders testimonials section with correct heading', () => {
    render(<Testimonials />);

    expect(screen.getByRole('heading', { name: 'What Our Users Say' })).toBeInTheDocument();
    expect(
      screen.getByText(/Thousands of job seekers have used Career Studio/)
    ).toBeInTheDocument();
  });

  test('renders all three testimonials', () => {
    render(<Testimonials />);

    // Check for all three testimonial authors
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('Lisa Rodriguez')).toBeInTheDocument();
  });

  test('displays correct job titles and companies', () => {
    render(<Testimonials />);

    expect(screen.getByText('Marketing Manager at TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer at InnovateSoft')).toBeInTheDocument();
    expect(screen.getByText('Graphic Designer at CreativeStudio')).toBeInTheDocument();
  });

  test('displays testimonial quotes', () => {
    render(<Testimonials />);

    expect(
      screen.getByText(/Career Studio helped me create a stunning portfolio/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Smart CV builder made it so easy to highlight/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/As a creative professional, I needed a portfolio/)
    ).toBeInTheDocument();
  });

  test('renders profile images with correct alt text', () => {
    render(<Testimonials />);

    const sarahImage = screen.getByAltText('Sarah Johnson');
    const michaelImage = screen.getByAltText('Michael Chen');
    const lisaImage = screen.getByAltText('Lisa Rodriguez');

    expect(sarahImage).toBeInTheDocument();
    expect(michaelImage).toBeInTheDocument();
    expect(lisaImage).toBeInTheDocument();

    // Check image sources
    expect(sarahImage).toHaveAttribute('src', 'https://randomuser.me/api/portraits/women/32.jpg');
    expect(michaelImage).toHaveAttribute('src', 'https://randomuser.me/api/portraits/men/46.jpg');
    expect(lisaImage).toHaveAttribute('src', 'https://randomuser.me/api/portraits/women/65.jpg');
  });

  test('displays star ratings for all testimonials', () => {
    render(<Testimonials />);

    const starRatings = screen.getAllByText('★★★★★');
    expect(starRatings).toHaveLength(3);
  });

  test('has correct section structure and styling', () => {
    render(<Testimonials />);

    // Find the main section by id
    const section = document.getElementById('testimonials');
    expect(section).toHaveClass('py-16', 'bg-gray-50');
    expect(section).toHaveAttribute('id', 'testimonials');
  });

  test('has correct container and grid layout', () => {
    render(<Testimonials />);

    const container = screen.getByText('What Our Users Say').closest('.container');
    expect(container).toHaveClass('container', 'mx-auto', 'px-4');

    const gridContainer = screen.getByText('Sarah Johnson').closest('.grid');
    expect(gridContainer).toHaveClass('grid', 'md:grid-cols-3', 'gap-8');
  });

  test('testimonial cards have correct styling', () => {
    render(<Testimonials />);

    const sarahCard = screen.getByText('Sarah Johnson').closest('.bg-white');
    expect(sarahCard).toHaveClass(
      'bg-white',
      'p-6',
      'rounded-lg',
      'shadow-md',
      'border',
      'border-gray-100'
    );
  });

  test('header section has correct styling', () => {
    render(<Testimonials />);

    const headerSection = screen.getByText('What Our Users Say').closest('.text-center');
    expect(headerSection).toHaveClass('text-center', 'mb-16');

    const mainHeading = screen.getByRole('heading', { name: 'What Our Users Say' });
    expect(mainHeading).toHaveClass(
      'text-3xl',
      'md:text-4xl',
      'font-bold',
      'text-[#6254a9]',
      'mb-4'
    );

    const subtitle = screen.getByText(/Thousands of job seekers/);
    expect(subtitle).toHaveClass('text-[#7764a0]', 'max-w-2xl', 'mx-auto');
  });

  test('profile images have correct styling', () => {
    render(<Testimonials />);

    const images = screen.getAllByRole('img');

    images.forEach((image) => {
      expect(image).toHaveClass('w-12', 'h-12', 'rounded-full', 'mr-4', 'object-cover');
    });
  });

  test('testimonial names have correct styling', () => {
    render(<Testimonials />);

    const nameElements = [
      screen.getByText('Sarah Johnson'),
      screen.getByText('Michael Chen'),
      screen.getByText('Lisa Rodriguez'),
    ];

    nameElements.forEach((nameElement) => {
      expect(nameElement).toHaveClass('font-bold', 'text-[#6254a9]');
      expect(nameElement.tagName).toBe('H4');
    });
  });

  test('job titles have correct styling', () => {
    render(<Testimonials />);

    const jobTitles = [
      screen.getByText('Marketing Manager at TechCorp'),
      screen.getByText('Software Engineer at InnovateSoft'),
      screen.getByText('Graphic Designer at CreativeStudio'),
    ];

    jobTitles.forEach((jobTitle) => {
      expect(jobTitle).toHaveClass('text-sm', 'text-[#7764a0]');
    });
  });

  test('star ratings have correct styling', () => {
    render(<Testimonials />);

    const starRatings = screen.getAllByText('★★★★★');

    starRatings.forEach((stars) => {
      expect(stars).toHaveClass('mb-4', 'text-[#6254a9]');
    });
  });

  test('quotes have correct styling', () => {
    render(<Testimonials />);

    const quotes = [
      screen.getByText(/Career Studio helped me create a stunning portfolio/),
      screen.getByText(/The Smart CV builder made it so easy to highlight/),
      screen.getByText(/As a creative professional, I needed a portfolio/),
    ];

    quotes.forEach((quote) => {
      expect(quote).toHaveClass('text-[#7764a0]', 'italic');
    });
  });

  test('profile sections have correct layout', () => {
    render(<Testimonials />);

    const profileSections = screen.getAllByText(
      /Marketing Manager|Software Engineer|Graphic Designer/
    );

    profileSections.forEach((section) => {
      const container = section.closest('.flex');
      expect(container).toHaveClass('items-center', 'mb-4');
    });
  });

  test('renders without errors', () => {
    expect(() => render(<Testimonials />)).not.toThrow();
  });

  test('accessibility: has proper heading structure', () => {
    render(<Testimonials />);

    // Should have one h2 (main heading) and three h4 (testimonial names)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
  });

  test('accessibility: images have proper alt text', () => {
    render(<Testimonials />);

    const images = screen.getAllByRole('img');

    images.forEach((image) => {
      expect(image).toHaveAttribute('alt');
      expect(image.getAttribute('alt')).toBeTruthy();
    });
  });

  test('displays consistent layout across all testimonials', () => {
    render(<Testimonials />);

    // Each testimonial should have: image, name, title, stars, quote
    const testimonialCards = screen
      .getAllByText('★★★★★')
      .map((stars) => stars.closest('.bg-white'));

    expect(testimonialCards).toHaveLength(3);

    testimonialCards.forEach((card) => {
      // Should contain image, name, role, stars, and quote
      expect(card?.querySelector('img')).toBeInTheDocument();
      expect(card?.querySelector('h4')).toBeInTheDocument();
      expect(card?.querySelector('.text-sm')).toBeInTheDocument();
      expect(card?.textContent).toContain('★★★★★');
      expect(card?.querySelector('.italic')).toBeInTheDocument();
    });
  });

  test('testimonial content is properly structured', () => {
    render(<Testimonials />);

    // Check that each testimonial has the expected structure
    const testimonialNames = ['Sarah Johnson', 'Michael Chen', 'Lisa Rodriguez'];

    testimonialNames.forEach((name) => {
      const nameElement = screen.getByText(name);
      const card = nameElement.closest('.bg-white');

      // Each card should have profile section, stars, and quote
      expect(card?.querySelector('.flex.items-center')).toBeInTheDocument();
      expect(card?.querySelector('img')).toBeInTheDocument();
      expect(card?.textContent).toContain('★★★★★');
      expect(card?.querySelector('.italic')).toBeInTheDocument();
    });
  });
});
