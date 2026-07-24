import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import logoImg from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { companyInfo } = useContent();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <img src={logoImg} alt="Mouryan Tech Solutions Logo" className="h-14 md:h-16 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed mt-4 max-w-xs">
              Reliable, affordable, and professional technology solutions for homes, offices, and businesses in Bengaluru.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors" aria-label="Facebook">FB</a>
              <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors" aria-label="Twitter">X</a>
              <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors" aria-label="Instagram">IG</a>
              <a href="#" className="text-slate-400 font-semibold hover:text-white transition-colors" aria-label="LinkedIn">IN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6">Top Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="hover:text-primary transition-colors">Laptop & Desktop Repair</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">CCTV Installation</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Networking Solutions</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Data Recovery</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Printer Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                <span className="text-sm">{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span className="text-sm">+91 {companyInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span className="text-sm">{companyInfo.email}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} {companyInfo.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-slate-500">Service Area: {companyInfo.serviceArea}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
