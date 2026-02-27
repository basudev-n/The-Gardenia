import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Amenities', id: 'amenities' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Floor Plans', id: 'floor-plans' },
    { label: 'Location', id: 'location' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
      isScrolled ? 'shadow-md border-b border-gray-100 h-16' : 'border-b border-gray-200 h-20'
    }`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="https://customer-assets.emergentagent.com/job_gardenia-pool/artifacts/c0fi5vvp_Untitled%20%28400%20x%20100%20px%29.png"
              alt="The Gardenia"
              className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14 md:h-16'}`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-3 py-2 mx-0.5 text-gray-600 hover:text-emerald-600 font-medium text-sm tracking-wide transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </button>
            ))}
          </nav>

          {/* Right side: Phone + CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:18008900428"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors duration-200">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold tracking-wide">1800 890 0428</span>
            </a>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm font-semibold tracking-wide"
            >
              Book a Visit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 hover:text-emerald-600 transition-all duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
              <a
                href="tel:18008900428"
                className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 px-4 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-semibold">1800 890 0428</span>
              </a>
              <Button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 font-semibold transition-all duration-300"
              >
                Book a Visit
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;