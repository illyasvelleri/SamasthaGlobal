'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';

export function Navbar() {
  return (
    <nav className="bg-islamic-primary text-white shadow-lg">
      {/* Desktop */}
      <div className="hidden md:flex container mx-auto px-4 py-4 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">Fatwa Navigator</Link>
        <SearchBar />
        <div className="space-x-6">
          <Link href="/categories">വിഭാഗങ്ങൾ</Link>
          <Link href="/saved">സേവ് ചെയ്തവ</Link>
          <Link href="/about">ഞങ്ങളെക്കുറിച്ച്</Link>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-islamic-primary text-white border-t border-gray-700 z-50">
        <div className="flex justify-around items-center py-3">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-xs">ഹോം</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center">
            <span className="text-xs">തിരയുക</span>
          </Link>
          <Link href="/saved" className="flex flex-col items-center">
            <span className="text-xs">സേവ്</span>
          </Link>
        </div>
      </div>

      {/* Mobile search bar in header */}
      <div className="md:hidden px-4 py-3">
        <SearchBar mobile={true} />
      </div>
    </nav>
  );
}