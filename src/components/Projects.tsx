import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'About', section: 'about' },
    { label: 'Projects', section: 'projects' },
    { label: 'DSA', section: 'dsa' },
    { label: 'Certificates', section: 'certificates' },
    { label: 'Contact', section: 'contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-card' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold portfolio-text-gradient"
          >
            Portfolio
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                className="text-muted-foreground hover:text-brand-primary transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            
            {user ? (
              <Button 
                onClick={signOut}
                variant="outline" 
                size="sm"
                className="shadow-card hover:shadow-hover transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/admin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  className="hero-gradient text-white shadow-card hover:shadow-hover transition-all duration-300"
                  onClick={() => scrollToSection('contact')}
                >
                  Hire Me
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-brand-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2 space-y-2">
                {user ? (
                  <Button 
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="w-full shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/admin" className="block">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full shadow-card hover:shadow-hover transition-all duration-300"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      className="w-full hero-gradient text-white shadow-card"
                      onClick={() => scrollToSection('contact')}
                    >
                      Hire Me
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;