import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Features from '../../components/Features';

describe('Features', () => {
  test('renders features section with correct heading', () => {
    render(<Features />);

    expect(screen.getByText('Everything You Need To Land That Job')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Career Studio provides all the tools you need to build an impressive online presence and get noticed by employers.'
      )
    ).toBeInTheDocument();
  });

  test('renders all three feature cards', () => {
    render(<Features />);

    // Check for Smart CV Builder
    expect(screen.getByText('Smart CV Builder')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Create professional resumes with our AI-powered CV builder. Get tailored suggestions and templates that match your industry.'
      )
    ).toBeInTheDocument();

    // Check for Portfolio Builder
    expect(screen.getByText('Portfolio Builder')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Showcase your best work with customizable portfolio templates. Highlight your skills and projects to impress employers.'
      )
    ).toBeInTheDocument();

    // Check for Content Assistant
    expect(screen.getByText('Content Assistant')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Writer's block? Let our AI help craft compelling descriptions of your experience and achievements."
      )
    ).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    render(<Features />);

    // Check that SVG icons are present
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements).toHaveLength(3); // One for each feature

    // Check icon styling
    svgElements.forEach((svg) => {
      expect(svg).toHaveClass('text-jobathon-600');
    });
  });

  test('applies correct styling to feature cards', () => {
    render(<Features />);

    // Check for feature card containers
    const featureCards = document.querySelectorAll('.bg-white.p-6.rounded-lg');
    expect(featureCards).toHaveLength(3);

    featureCards.forEach((card) => {
      expect(card).toHaveClass(
        'border',
        'border-gray-100',
        'shadow-sm',
        'hover:shadow-md',
        'transition-shadow',
        'duration-300'
      );
    });
  });

  test('has proper grid layout', () => {
    render(<Features />);

    const gridContainer = document.querySelector('.grid.md\\:grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-8');
  });

  test('has proper section spacing and background', () => {
    render(<Features />);

    const featuresSection = document.querySelector('#features');
    expect(featuresSection).toBeInTheDocument();
    expect(featuresSection).toHaveClass('py-16', 'bg-white');
  });

  test('applies correct text colors', () => {
    render(<Features />);

    // Check main heading color
    const mainHeading = screen.getByText('Everything You Need To Land That Job');
    expect(mainHeading).toHaveClass('text-[#6254a9]');

    // Check feature titles color
    const smartCvTitle = screen.getByText('Smart CV Builder');
    expect(smartCvTitle).toHaveClass('text-[#6254a9]');

    const portfolioTitle = screen.getByText('Portfolio Builder');
    expect(portfolioTitle).toHaveClass('text-[#6254a9]');

    const contentTitle = screen.getByText('Content Assistant');
    expect(contentTitle).toHaveClass('text-[#6254a9]');
  });

  test('renders icon containers with proper styling', () => {
    render(<Features />);

    // Check for icon containers
    const iconContainers = document.querySelectorAll('.bg-jobathon-50.rounded-full');
    expect(iconContainers).toHaveLength(3);

    iconContainers.forEach((container) => {
      expect(container).toHaveClass(
        'w-16',
        'h-16',
        'flex',
        'items-center',
        'justify-center',
        'mb-4'
      );
    });
  });
});
