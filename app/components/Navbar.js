// // components/Header.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Menu, X, ChevronRight } from 'lucide-react';

// export default function Header() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'Fiqh', href: '/fiqh' },
//     { name: 'Assistant', href: '/bot' },
//     { name: 'Fatwas', href: '/fatwa' },
//     // { name: 'Contact', href: '/contact' },
//   ];

//   return (
//     <>
//       {/* Main Header – unchanged for desktop */}
//       <header
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 lg:px-20 pt-4 md:pt-6 `}
//       >
//         <div className="max-w-[1600px] mx-auto bg-white/95 backdrop-blur-xl shadow-2xl flex justify-between items-center py-4 px-6 rounded rounded-2xl">
//           <div className="text-[#0B1F3B] font-bold text-lg tracking-tight">
//             Smastha Univerce<span className="text-[#00B4D8]">.</span>
//           </div>

//           {/* Desktop Nav – exactly as you had */}
//           <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0B1F3B]">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className="hover:text-[#00B4D8] transition-colors duration-300"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Mobile Hamburger – opens offcanvas */}
//           <button
//             className="md:hidden text-[#0B1F3B] focus:outline-none"
//             onClick={() => setIsMobileMenuOpen(true)}
//             aria-label="Open menu"
//           >
//             <Menu className="w-7 h-7" />
//           </button>
//         </div>
//       </header>

//       {/* Mobile Offcanvas Sidebar – slides from right */}
//       <div
//         className={`fixed inset-y-0 right-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-in-out ${
//           isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//         } md:hidden`}
//       >
//         {/* Header inside sidebar */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="text-[#0B1F3B] font-bold text-xl tracking-tight">
//             Smastha Univerce<span className="text-[#00B4D8]">.</span>
//           </div>
//           <button
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="text-[#0B1F3B] hover:text-[#00B4D8] transition-colors"
//             aria-label="Close menu"
//           >
//             <X className="w-8 h-8" />
//           </button>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex flex-col p-6 space-y-6 text-lg font-medium text-[#0B1F3B]">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className="hover:text-[#00B4D8] transition-colors duration-300 flex items-center justify-between group"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {link.name}
//               <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Backdrop overlay when sidebar is open */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// }



"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, BookOpen, MessageSquare, Scale, X, Menu , Pen } from "lucide-react";

export default function RightIconSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/fiqh", icon: BookOpen, label: "Fiqh" },
    { href: "/bot", icon: MessageSquare, label: "Assistant" },
    { href: "/fatwa", icon: Scale, label: "Fatwas" },
    { href: "https://edu-track-gamma.vercel.app/admin/student-portal/dashboard", icon: Pen, label: "EduTrack" },
  ];

  return (
    <>
      {/* ─── FLOATING ICON BUTTON ─── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className={`
          fixed top-6 right-6 z-50
          p-4 rounded-2xl
          bg-white/70 backdrop-blur-xl border border-slate-100/70
          shadow-lg shadow-black/5
          hover:bg-white/90 hover:shadow-xl hover:shadow-[#00B4D8]/10
          active:scale-95
          transition-all duration-300
        `}
      >
        <Menu className="w-7 h-7 text-[#0B1F3B]" strokeWidth={2.2} />
      </button>

      {/* ─── RIGHT SIDEBAR / DRAWER ─── */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50
          w-20 sm:w-24 bg-white/92 backdrop-blur-2xl
          border-l border-slate-100/60
          shadow-[-16px_0_40px_-12px_rgba(0,0,0,0.18)]
          transform transition-transform duration-400 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full items-center pt-6">

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              mb-10 p-3 rounded-xl
              hover:bg-slate-100/70 active:bg-slate-200/60
              transition-colors
            "
            aria-label="Close menu"
          >
            <X className="w-7 h-7 text-[#0B1F3B]" strokeWidth={2.2} />
          </button>

          {/* Icon-only navigation */}
          <nav className="flex flex-col items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                title={item.label} // tooltip on hover
                className={`
                  group relative p-3.5 rounded-xl
                  text-[#0B1F3B] hover:text-[#00B4D8]
                  hover:bg-gradient-to-br hover:from-[#00B4D8]/10 hover:to-transparent
                  transition-all duration-250
                  active:scale-95
                `}
              >
                <item.icon className="w-7 h-7" strokeWidth={2} />

                {/* Tooltip label on hover (nice touch for icon-only) */}
                <span
                  className={`
                    absolute right-full mr-4 top-1/2 -translate-y-1/2
                    px-4 py-2 bg-[#0B1F3B]/90 text-white text-sm rounded-lg
                    opacity-0 pointer-events-none group-hover:opacity-100
                    transition-opacity duration-200 whitespace-nowrap
                    shadow-lg
                  `}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Optional small brand mark at bottom */}
          <div className="mt-auto mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00B4D8]/20 to-[#0B1F3B]/10 flex items-center justify-center text-[#00B4D8] font-bold text-xs">
              S
            </div>
          </div>
        </div>
      </div>

      {/* ─── BACKDROP ─── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0 bg-black/30 backdrop-blur-sm z-40
            transition-opacity duration-400
          "
        />
      )}
    </>
  );
}
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { Menu, X, ChevronRight } from "lucide-react";

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navLinks = [
//     { name: "Home", href: "/" },
//     { name: "Fiqh", href: "/fiqh" },
//     { name: "Assistant", href: "/bot" },
//     { name: "Fatwas", href: "/fatwa" },
//   ];

//   return (
//     <>
//       {/* ================= DESKTOP NAVBAR ONLY ================= */}
//       <header className="hidden md:block fixed top-0 left-0 w-full z-50 px-12 lg:px-20 pt-6">
//         <div className="max-w-[1600px] mx-auto bg-white/95 backdrop-blur-xl shadow-2xl flex justify-between items-center py-4 px-6 rounded-2xl">
//           <div className="text-[#0B1F3B] font-bold text-lg tracking-tight">
//             Smastha Univerce<span className="text-[#00B4D8]">.</span>
//           </div>

//           <nav className="flex items-center gap-8 text-sm font-medium text-[#0B1F3B]">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className="hover:text-[#00B4D8] transition-colors"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* ================= MOBILE FLOATING MENU BUTTON ================= */}
//       {!isMobileMenuOpen && (
//         <button
//           onClick={() => setIsMobileMenuOpen(true)}
//           aria-label="Open menu"
//           className="md:hidden fixed top-5 right-5 z-50 bg-white/90 backdrop-blur-xl shadow-xl rounded-full p-3"
//         >
//           <Menu className="w-7 h-7 text-[#0B1F3B]" />
//         </button>
//       )}

//       {/* ================= MOBILE SIDEBAR ================= */}
//       <div
//         className={`fixed inset-y-0 right-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden ${
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="text-[#0B1F3B] font-bold text-xl">
//             Smastha Univerce<span className="text-[#00B4D8]">.</span>
//           </div>
//           <button
//             onClick={() => setIsMobileMenuOpen(false)}
//             aria-label="Close menu"
//             className="text-[#0B1F3B]"
//           >
//             <X className="w-8 h-8" />
//           </button>
//         </div>

//         {/* Sidebar Nav */}
//         <nav className="flex flex-col p-6 space-y-6 text-lg font-medium text-[#0B1F3B]">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="flex items-center justify-between group hover:text-[#00B4D8] transition"
//             >
//               {link.name}
//               <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* ================= BACKDROP ================= */}
//       {isMobileMenuOpen && (
//         <div
//           onClick={() => setIsMobileMenuOpen(false)}
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
//         />
//       )}
//     </>
//   );
// }
