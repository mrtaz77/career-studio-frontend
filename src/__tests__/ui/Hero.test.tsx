import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../../components/Hero';

describe('Hero', () => {
  test('renders hero section with correct content', () => {
    render(<Hero />);

    // Check for main heading using more flexible matcher
    expect(screen.getByText(/Build Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Dream Career/i)).toBeInTheDocument();
    expect(screen.getByText(/With Confidence/i)).toBeInTheDocument();

    // Check for description
    expect(
      screen.getByText(
        'Create stunning portfolios and smart CVs that get you noticed. Stand out from the crowd with Career Studios powerful career tools.'
      )
    ).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    render(<Hero />);

    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    const learnMoreButton = screen.getByRole('button', { name: /learn more/i });

    expect(getStartedButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();

    // Check button styling classes
    expect(getStartedButton).toHaveClass('bg-[#6254a9]');
    expect(learnMoreButton).toHaveClass('border-[#C5BAFF]');
  });

  test('renders mockup interface', () => {
    render(<Hero />);

    // Check for browser mockup elements (the colored dots)
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();

    // Check for mockup content placeholders
    const mockupContainer = container?.querySelector('.bg-white.p-6.rounded-lg.shadow-xl');
    expect(mockupContainer).toBeInTheDocument();
  });

  test('renders success badge', () => {
    render(<Hero />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  test('has proper responsive layout classes', () => {
    render(<Hero />);

    const heroSection = document.querySelector('.bg-gradient-to-br');
    expect(heroSection).toHaveClass('py-16', 'md:py-24');

    const container = document.querySelector('.container');
    expect(container).toHaveClass('mx-auto', 'px-4');
  });

  test('applies correct color scheme', () => {
    render(<Hero />);

    // Check gradient background
    const heroSection = document.querySelector('.bg-gradient-to-br');
    expect(heroSection).toHaveClass('from-jobathon-50', 'to-white');

    // Check text colors
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-[#C5BAFF]');

    const dreamCareer = screen.getByText('Dream Career');
    expect(dreamCareer).toHaveClass('text-[#6254a9]');
  });
});
