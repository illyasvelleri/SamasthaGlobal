// app/fatwas/page.tsx   (or app/page.tsx)

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getFatwaData } from '@/lib/data';

const FatwaCard = ({ fatwa }) => {
  return (
    <Link
      href={`/fatwa/${fatwa.id}`}
      className="group block rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 p-6 md:p-7 hover:bg-white hover:shadow-xl hover:scale-[1.015] transition-all duration-300 relative overflow-hidden"
    >
      {/* Category & meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200/60">
          {fatwa.category}
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{fatwa.views.toLocaleString()} views</span>
          <span>•</span>
          <span>{fatwa.date}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
        {fatwa.title}
      </h3>

      {/* Question + Excerpt – unchanged (card content preserved in original language) */}
      <div className="space-y-2 mb-5">
        <p className="text-sm font-semibold text-emerald-800">Question:</p>
        <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
          {fatwa.question}
        </p>
        <p className="text-sm text-slate-500 line-clamp-2 italic">
          {fatwa.excerpt}
        </p>
      </div>

      <div className="flex items-center text-sm">
        <span className="text-emerald-600 font-medium group-hover:underline">
          Read →
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
    </Link>
  );
};

export default function FatwasPage() {
  const { categories = [], fatwas = [] } = getFatwaData();

  const [showContent, setShowContent] = useState(false);

  const handleStart = () => {
    setShowContent(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 relative overflow-x-hidden">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100/40 via-transparent to-neutral-50/30" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/10 to-blue-100/5 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Entry Screen */}
      <div
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out ${
          showContent ? 'opacity-0 pointer-events-none scale-98' : 'opacity-100'
        }`}
      >
        <div className="max-w-3xl w-full text-center space-y-10 md:space-y-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-slate-800">
            Authentic Fatwa Collection in One Place
          </h1>

          <button
            onClick={handleStart}
            className="inline-flex px-16 py-7 md:px-20 md:py-8 text-xl md:text-2xl font-medium bg-emerald-700 text-white rounded-2xl shadow-xl hover:bg-emerald-800 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-[1.03] active:scale-100"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Main Content – revealed after "Get Started" */}
      <div
        className={`transition-all duration-800 ease-out ${
          showContent ? 'opacity-100' : 'opacity-0 pt-20'
        }`}
      >
        <main className="pt-10 md:pt-16 pb-20 md:pb-24">
          {/* Header Section */}
          <section className="px-5 sm:px-8 lg:px-12 py-12 md:py-16 text-center">
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
                <span className="text-xl">📖</span>
                <span className="text-base font-semibold text-slate-700">Fatwa Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                All Fatwas
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-3">
                  In One Place
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Search, read, and study authentic Islamic scholarly rulings.
              </p>
            </div>
          </section>

          {/* Category Pills */}
          <section className="px-5 sm:px-8 lg:px-12 pb-10 md:pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`group px-6 py-3 rounded-full bg-gradient-to-r ${cat.gradient} text-white text-sm md:text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2.5`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="text-xs bg-white/25 px-2.5 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Fatwas Grid + Filters */}
          <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 md:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  All Fatwas
                </h2>

                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                  <select className="px-5 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 min-w-[180px]">
                    <option>Latest First</option>
                    <option>Most Viewed</option>
                    <option>Oldest First</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search (e.g., fasting, zakat...)"
                    className="flex-1 sm:flex-none sm:min-w-[280px] px-5 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {fatwas.map((fatwa) => (
                  <FatwaCard key={fatwa.id} fatwa={fatwa} />
                ))}
              </div>

              {/* Load more */}
              <div className="text-center mt-12 md:mt-16">
                <button className="px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Load More
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm py-10 px-6 text-center text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Fatwa Navigator • Samastha Kerala Jamiyyathul Ulama</p>
        </footer>
      </div>
    </div>
  );
}