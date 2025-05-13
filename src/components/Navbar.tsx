
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  openAuthDialog?: (mode: "login" | "signup") => void;
}

const Navbar = ({ openAuthDialog }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
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
            <Link to="/" className="text-gray-600 hover:text-jobathon-600 font-medium">Home</Link>
            {/* <Link to="#features" className="text-gray-600 hover:text-jobathon-600 font-medium">Features</Link>
            <Link to="#testimonials" className="text-gray-600 hover:text-jobathon-600 font-medium">Testimonials</Link> */}
          </div>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={currentUser.photoURL || ""} />
                    <AvatarFallback className="bg-jobathon-100 text-jobathon-600 font-medium">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.displayName || "User"}</span>
                      <span className="text-xs text-gray-500 font-normal">{currentUser.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="space-x-3">
              <Button 
                variant="outline" 
                className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50"
                onClick={() => openAuthDialog && openAuthDialog("login")}
              >
                Login
              </Button>
              <Button 
                className="bg-jobathon-600 hover:bg-jobathon-700"
                onClick={() => openAuthDialog && openAuthDialog("signup")}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-lg border-t animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 hover:text-jobathon-600 py-2">Home</Link>
            <Link to="#features" className="text-gray-600 hover:text-jobathon-600 py-2">Features</Link>
            <Link to="#testimonials" className="text-gray-600 hover:text-jobathon-600 py-2">Testimonials</Link>
            <hr className="border-gray-200" />
            
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <Avatar>
                    <AvatarImage src={currentUser.photoURL || ""} />
                    <AvatarFallback className="bg-jobathon-100 text-jobathon-600 font-medium">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentUser.displayName || "User"}</span>
                    <span className="text-xs text-gray-500">{currentUser.email}</span>
                  </div>
                </div>
                <Button 
                  className="bg-jobathon-600 hover:bg-jobathon-700 w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50 w-full"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-jobathon-600 text-jobathon-600 hover:bg-jobathon-50 w-full"
                  onClick={() => {
                    openAuthDialog && openAuthDialog("login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="bg-jobathon-600 hover:bg-jobathon-700 w-full"
                  onClick={() => {
                    openAuthDialog && openAuthDialog("signup");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;