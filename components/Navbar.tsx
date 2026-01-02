
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
// Fix: Re-writing the import to resolve "no exported member" errors which can occur in some TS environments
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleFeatureClick = (e: React.MouseEvent) => {
    if (location.pathname !== '/') {
      // Allow react-router to handle navigation
    } else {
       e.preventDefault();
       const element = document.getElementById('features');
       if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
       }
    }
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-dark">Siswa<span className="text-primary">Cerdas</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition">Home</Link>
            {location.pathname === '/' ? (
              <button onClick={handleFeatureClick} className="text-gray-600 hover:text-primary font-medium transition">Features</button>
            ) : (
              <Link to="/#features" className="text-gray-600 hover:text-primary font-medium transition">Features</Link>
            )}
            <Link to="/cards" className="text-gray-600 hover:text-primary font-medium transition">Kartu Siswa</Link>
            <Link to="/blog" className="text-gray-600 hover:text-primary font-medium transition">Blog</Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/login" className="text-dark font-semibold hover:text-primary px-4 py-2 transition">Log in</Link>
            <Link to="/register-school" className="bg-secondary hover:bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-orange-200">
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-dark focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full pb-4 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-600 font-medium">Home</Link>
            <Link to="/cards" className="block px-3 py-2 text-gray-600 font-medium">Kartu Siswa</Link>
            <Link to="/blog" className="block px-3 py-2 text-gray-600 font-medium">Blog</Link>
            <div className="pt-4 flex flex-col gap-3">
               <Link to="/login" className="w-full text-center text-dark font-semibold py-2">Log in</Link>
               <Link to="/register-school" className="w-full bg-secondary text-white py-3 rounded-xl font-medium text-center">Register</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
