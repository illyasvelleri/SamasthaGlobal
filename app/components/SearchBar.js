'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar({ mobile = false }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${mobile ? '' : 'max-w-xl'}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="തിരയുക... (വിഷയം, ടാഗ്, വാക്ക്)"
          className="w-full px-4 py-3 pr-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-islamic-accent"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-islamic-accent"
        >
          🔍
        </button>
      </div>
    </form>
  );
}