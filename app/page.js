// // app/page.js - Modern Fatwa Navigator Landing Page
// // Clean, premium, English hero, fetches real data from JSON

// import Link from "next/link";
// import { getFatwaData } from "@/lib/data";

// export const metadata = {
//   title: 'Fatwa Navigator | Authentic Islamic Answers',
//   description: 'Official fatwas from Samastha Kerala Jami’yyathul Ulama — search, read, understand.',
// };

// export default async function Home() {
//   const { categories = [], fatwas = [] } = getFatwaData();

//   // Take the latest 6 fatwas for "Recent" section
//   const recentFatwas = fatwas.slice(0, 6);

//   return (
//     <div dir="rtr" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-x-hidden">
//       {/* Ambient Blobs */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
//       </div>

//       {/* Hero Section – Pure English, minimal */}
//       <section className="relative min-h-[85vh] flex items-center justify-center px-5 sm:px-8 lg:px-12 py-20 overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
//         </div>

//         <div className="relative z-10 max-w-5xl w-full text-center space-y-10 md:space-y-12">
//           <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
//             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-semibold text-slate-700">Official Samastha Univerce Platform</span>
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
//             {/* <span className="block text-slate-900">Ask Any Islamic Question</span> */}
//             <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Explore Our Smastha Univerce
//             </span>
//           </h1>

//           <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
//             Instant clarity from trusted Source — anytime, anywhere.
//           </p>

//           {/* CTAs */}
//           <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">
//             <Link
//               href="/bot"
//               className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
//             >
//               <span className="text-xl">✨</span>
//               City Assistent
//             </Link>

//             <Link
//               href="/fiqh"
//               className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/70 hover:border-emerald-400 hover:shadow-xl text-slate-700 font-bold transition-all duration-300 hover:scale-105"
//             >
//               Fiqh AI
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Recent Fatwas – Only this section */}
//       <section className="px-4 sm:px-6 lg:px-8 py-20">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between mb-10">
//             <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
//               Recent Fatwas
//             </h2>
//             <Link href="/fatwas" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 hover:gap-3 transition-all">
//               View All
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {recentFatwas.map((fatwa) => (
//               <FatwaCard key={fatwa.id} fatwa={fatwa} />
//             ))}
//           </div>
//         </div>
//       </section>

  

//       {/* Footer */}
//       <footer className="border-t border-slate-200/50 bg-white/40 py-12 px-6 mt-32">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-600">
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
//                 ف
//               </div>
//               <div className="font-bold text-slate-900">Fatwa Navigator</div>
//             </div>
//             <p className="leading-relaxed">
//               Official platform by Samastha Kerala Jami'yyathul Ulama
//             </p>
//           </div>

//           <div>
//             <h4 className="font-bold text-slate-900 mb-4">Links</h4>
//             <ul className="space-y-2">
//               <li><Link href="/fatwas" className="hover:text-emerald-600 transition">All Fatwas</Link></li>
//               <li><Link href="/categories" className="hover:text-emerald-600 transition">Categories</Link></li>
//               <li><Link href="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2">
//                 info@fatwanavigator.com
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-12 pt-8 border-t border-slate-200/50 text-center text-sm text-slate-500">
//           © {new Date().getFullYear()} Fatwa Navigator. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// // FatwaCard – Clean & Modern
// function FatwaCard({ fatwa }) {
//   return (
//     <Link
//       href={`/fatwa/${fatwa.id}`}
//       className="group block rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 p-6 hover:bg-white/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200/60">
//           {fatwa.category}
//         </span>
//         <div className="flex items-center gap-3 text-xs text-slate-500">
//           <span>{fatwa.views.toLocaleString()} views</span>
//           <span>•</span>
//           <span>{fatwa.date}</span>
//         </div>
//       </div>

//       <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
//         {fatwa.title}
//       </h3>

//       <div className="space-y-2 mb-5">
//         <p className="text-sm font-semibold text-emerald-800">Question:</p>
//         <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
//           {fatwa.question}
//         </p>
//         <p className="text-sm text-slate-500 line-clamp-3 italic">
//           {fatwa.excerpt || "Details not available"}
//         </p>
//       </div>

//       <div className="flex items-center justify-between text-sm">
//         <span className="text-emerald-600 font-medium group-hover:underline">
//           Read →
//         </span>
//       </div>

//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
//     </Link>
//   );
// }








// app/page.js - Samastha Universe Entry Page
// Premium, single-screen, 100vh flagship design

import Link from "next/link";

export const metadata = {
  title: 'Samastha Universe | Authentic Islamic Knowledge',
  description: 'Official platform by Samastha Kerala Jami\'yyathul Ulama',
};

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-stone-50 via-white to-blue-50/10 pt-16">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/20 via-blue-200/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative h-full flex items-center justify-center px-6 sm:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-sm border border-slate-200/30 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700 tracking-wide">Official Samastha Platform</span>
          </div>

          {/* Intelligence Indicator */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/90 to-blue-600/90 rounded-3xl shadow-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
            </div>
          </div>

          {/* Value Statement */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
              Samastha Universe
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 font-light max-w-xl mx-auto">
              Trusted guidance from Samastha Kerala Jami'yyathul Ulama
            </p>
          </div>

          {/* Primary Action */}
          <div className="pt-4">
            <Link
              href="/bot"
              className="inline-flex items-center justify-center px-14 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-base font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-500 hover:scale-[1.02]"
            >
              City Assistant
            </Link>
          </div>

          {/* Minimal Platform Indicators */}
          <div className="pt-16 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 bg-emerald-100/60 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-xs font-medium">AI Assistant</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 bg-blue-100/60 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-medium">Fiqh Library</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-8 h-8 bg-indigo-100/60 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Fatwa Navigator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Samastha Universe</span>
          <span className="hidden sm:inline">Samastha Kerala Jami'yyathul Ulama</span>
        </div>
      </div>
    </div>
  );
}