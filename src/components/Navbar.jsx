import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(false); // Can be linked to a Context later
  const { companyInfo } = useContent();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-white dark:bg-slate-900 py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Mouryan Tech Solutions Logo" className="h-14 md:h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Theme">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a 
              href={`https://wa.me/91${companyInfo.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-hover transition-all shadow-sm hover:shadow"
            >
              Emergency Support
            </a>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2" aria-label="Toggle Theme">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleMenu} className="text-foreground focus:outline-none p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-lg border-t border-border py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2 rounded-lg font-medium ${
                location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a 
            href={`https://wa.me/91${companyInfo.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-primary text-white px-4 py-3 rounded-lg font-medium"
          >
            24x7 Emergency Support
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
