// components/Header.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Fiqh', href: '/fiqh' },
    { name: 'Assistant', href: '/bot' },
    { name: 'Fatwas', href: '/fatwa' },
    // { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Main Header – unchanged for desktop */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 lg:px-20 pt-4 md:pt-6 `}
      >
        <div className="max-w-[1600px] mx-auto bg-white/95 backdrop-blur-xl shadow-2xl flex justify-between items-center py-4 px-6 rounded rounded-2xl">
          <div className="text-[#0B1F3B] font-bold text-lg tracking-tight">
            Smastha Univerce<span className="text-[#00B4D8]">.</span>
          </div>

          {/* Desktop Nav – exactly as you had */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0B1F3B]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-[#00B4D8] transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger – opens offcanvas */}
          <button
            className="md:hidden text-[#0B1F3B] focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Mobile Offcanvas Sidebar – slides from right */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        {/* Header inside sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="text-[#0B1F3B] font-bold text-xl tracking-tight">
            Smastha Univerce<span className="text-[#00B4D8]">.</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#0B1F3B] hover:text-[#00B4D8] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-6 space-y-6 text-lg font-medium text-[#0B1F3B]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[#00B4D8] transition-colors duration-300 flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Backdrop overlay when sidebar is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}