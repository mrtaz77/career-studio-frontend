import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white py-4 border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-jobathon-700 font-display font-bold text-2xl">Career Studio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="space-x-6">
            <Link to="/" className="text-gray-600 hover:text-jobathon-600 font-medium">
              Home
            </Link>
            <Link to="#features" className="text-gray-600 hover:text-jobathon-600 font-medium">
              Features
            </Link>
            <Link to="#testimonials" className="text-gray-600 hover:text-jobathon-600 font-medium">
              Testimonials
            </Link>
          </div>

          <div className="space-x-3">
            <Button
              variant="outline"
              className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50"
            >
              Login
            </Button>
            <Button className="bg-jobathon-600 hover:bg-jobathon-700">Sign up</Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-lg border-t animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 hover:text-jobathon-600 py-2">
              Home
            </Link>
            <Link to="#features" className="text-gray-600 hover:text-jobathon-600 py-2">
              Features
            </Link>
            <Link to="#testimonials" className="text-gray-600 hover:text-jobathon-600 py-2">
              Testimonials
            </Link>
            <hr className="border-gray-200" />
            <Button
              variant="outline"
              className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50 w-full"
            >
              Login
            </Button>
            <Button className="bg-jobathon-600 hover:bg-jobathon-700 w-full">Sign up</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
