import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('displays the "Created by:" text', () => {
    render(<Footer />);
    expect(screen.getByText('Created by:')).toBeInTheDocument();
  });

  it('renders GitHub link with correct href', () => {
    render(<Footer />);
    const link = screen.getByTitle('My GH');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://github.com/olga-kacala');
  });

  it('renders LinkedIn link with correct href', () => {
    render(<Footer />);
    const link = screen.getByTitle('My LinkedIn');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.linkedin.com/in/olga-kacala/');
  });

  it('renders GitHub and LinkedIn images with correct alt attributes', () => {
    render(<Footer />);
    expect(screen.getByAltText('GitHub')).toBeInTheDocument();
    expect(screen.getByAltText('LinkedIn')).toBeInTheDocument();
  });
  
});
