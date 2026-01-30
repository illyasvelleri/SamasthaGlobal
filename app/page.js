// app/page.js - Modern Fatwa Navigator Landing Page
// Clean, premium, English hero, fetches real data from JSON

import Link from "next/link";
import { getFatwaData } from "@/lib/data";

export const metadata = {
  title: 'Fatwa Navigator | Authentic Islamic Answers',
  description: 'Official fatwas from Samastha Kerala Jami’yyathul Ulama — search, read, understand.',
};

export default async function Home() {
  const { categories = [], fatwas = [] } = getFatwaData();

  // Take the latest 6 fatwas for "Recent" section
  const recentFatwas = fatwas.slice(0, 6);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-x-hidden">
      {/* Ambient Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section – Pure English, minimal */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-5 sm:px-8 lg:px-12 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-5xl w-full text-center space-y-10 md:space-y-12">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">Official Samastha Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="block text-slate-900">Ask Any Islamic Question</span>
            <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Get Clear Authentic Answers
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            Instant clarity from trusted fatwas — anytime, anywhere.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">
            <Link
              href="/bot"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-xl">✨</span>
              City Assistent
            </Link>

            <Link
              href="/fatwa"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/70 hover:border-emerald-400 hover:shadow-xl text-slate-700 font-bold transition-all duration-300 hover:scale-105"
            >
              Browse All Fatwas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Fatwas – Only this section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Recent Fatwas
            </h2>
            <Link href="/fatwas" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFatwas.map((fatwa) => (
              <FatwaCard key={fatwa.id} fatwa={fatwa} />
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Bottom AI Bar – Search icon on right */}
      {/* <div className="fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4 md:px-8 md:pb-6 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl">
        <div className="relative group">
      
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-indigo-400/30 blur-xl opacity-70 group-focus-within:opacity-100 transition-all duration-500"></div>

          <div className="relative backdrop-blur-2xl bg-white/80 border border-white/30 rounded-3xl shadow-2xl px-5 py-4">
      
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Fatwa AI Assistant</span>
              </div>
              <span className="text-xs opacity-70">Powered by AI</span>
            </div>

      
            <div className="flex items-center gap-3">
             
              <textarea
                rows="1"
                placeholder="Ask any question..."
                className="flex-1 bg-transparent resize-none outline-none text-base text-slate-900 placeholder:text-slate-500 leading-relaxed text-left"
              />

          
              <div className="flex items-center gap-2">
             
                <button className="w-10 h-10 rounded-xl bg-white/60 border border-slate-200/70 flex items-center justify-center hover:bg-white/80 transition text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

          
                <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white hover:scale-105 transition shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/40 py-12 px-6 mt-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-600">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                ف
              </div>
              <div className="font-bold text-slate-900">Fatwa Navigator</div>
            </div>
            <p className="leading-relaxed">
              Official platform by Samastha Kerala Jami'yyathul Ulama
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link href="/fatwas" className="hover:text-emerald-600 transition">All Fatwas</Link></li>
              <li><Link href="/categories" className="hover:text-emerald-600 transition">Categories</Link></li>
              <li><Link href="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                info@fatwanavigator.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/50 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Fatwa Navigator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// FatwaCard – Clean & Modern
function FatwaCard({ fatwa }) {
  return (
    <Link
      href={`/fatwa/${fatwa.id}`}
      className="group block rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 p-6 hover:bg-white/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
    >
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

      <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
        {fatwa.title}
      </h3>

      <div className="space-y-2 mb-5">
        <p className="text-sm font-semibold text-emerald-800">Question:</p>
        <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
          {fatwa.question}
        </p>
        <p className="text-sm text-slate-500 line-clamp-3 italic">
          {fatwa.excerpt || "Details not available"}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-emerald-600 font-medium group-hover:underline">
          Read →
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
    </Link>
  );
}