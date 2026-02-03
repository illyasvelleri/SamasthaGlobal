// // app/fatwa/[id]/page.js

// "use client";

// import { use } from "react";
// import Link from "next/link";
// import { getFatwaById } from "@/lib/data";   // ← THIS LINE — use @/ or correct relative path

// export default function FatwaDetailPage({ params }) {
//   const { id } = use(params); // ✅ unwrap promise
//   const fatwa = getFatwaById(id);
//   if (!fatwa) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-16">
//         <div className="text-center p-10 bg-white/80 rounded-2xl shadow-xl max-w-md">
//           <h1 className="text-3xl font-bold text-slate-800 mb-4">ഫത്വ കണ്ടെത്തിയില്ല</h1>
//           <p className="text-slate-600 mb-6">ID: {id} — ഈ ഫത്വ JSON-ൽ ഇല്ല</p>
//           <Link
//             href="/fatwa"
//             className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
//           >
//             എല്ലാ ഫത്വകളിലേക്ക് തിരികെ
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-left">
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
//       </div>

//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left">
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
//           <Link
//             href="/fatwa"
//             className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
//           >
//             ← Back to All Fatwas
//           </Link>

//           <div className="flex items-center gap-4 text-sm text-slate-500">
//             <span>{fatwa.views?.toLocaleString() || 0} views</span>
//             <span>•</span>
//             <span>{fatwa.date || "—"}</span>
//           </div>
//         </div>

//         <article className="rounded-3xl bg-white/75 backdrop-blur-md border border-white/60 shadow-xl p-6 md:p-10 text-left">
//           {fatwa.category && (
//             <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 font-medium text-sm mb-6">
//               {fatwa.category}
//             </span>
//           )}

//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight text-left">
//             {fatwa.title}
//           </h1>

//           <div className="mb-10 pb-8 border-b border-slate-200/60 text-left">
//             <h2 className="text-lg font-semibold text-emerald-800 mb-3 text-left">Question:</h2>
//             <p className="text-lg text-slate-800 leading-relaxed text-left">
//               {fatwa.question}
//             </p>
//           </div>

//           <div className="prose prose-slate max-w-none text-left">
//             <h2 className="text-xl font-semibold text-emerald-800 mb-4 text-left">Answer:</h2>
//             <div className="text-base leading-8 whitespace-pre-wrap font-medium text-left">
//               {fatwa.answer}
//             </div>

//             {fatwa.source && (
//               <p className="mt-10 text-sm text-slate-600 italic border-t border-slate-200/50 pt-4 text-left">
//                 Source: {fatwa.source}
//               </p>
//             )}
//           </div>
//         </article>

//         <div className="mt-10 flex flex-wrap gap-4 justify-start text-left">
//           <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2">
//             Share
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
//             </svg>
//           </button>

//           <Link
//             href="/fatwa"
//             className="px-6 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-md text-slate-700 font-medium transition-all"
//           >
//             View Other Fatwas
//           </Link>
//         </div>
//       </main>

//       <footer className="mt-16 py-12 border-t border-slate-200/50 backdrop-blur-sm bg-white/40 text-center md:text-left">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-600">
//             <div>
//               <p>© 2025 Fatwa Navigator</p>
//               <p className="mt-1">Samastha Kerala Jami'yyathul Ulama</p>
//             </div>
//             <div className="flex gap-6">
//               <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
//               <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Use</a>
//               <a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a>
//             </div>
//           </div>
//           <p className="mt-6 text-xs text-slate-500">
//             Authentic Islamic Guidance in the Digital Age
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// app/fatwa/[id]/page.tsx
// Ultra-minimal, calm, high-trust reading view
// No navigation bar, no footer links by default, very low density

"use client";

import { use } from "react";
import { getFatwaById } from "@/lib/data";

export default function FatwaDetail({ params }) {
  const { id } = use(params);
  const fatwa = getFatwaById(id);

  if (!fatwa) {
    return (
      <div className="min-h-screen bg-stone-50/70 flex items-center justify-center p-6">
        <div className="max-w-lg text-center space-y-6">
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight">
            Content not found
          </h1>
          <p className="text-slate-600 text-lg">
            The requested item could not be located.
          </p>
          {/* Very discreet way back – no big button */}
          <div className="pt-4">
            <a
              href="/fatwa"
              className="text-slate-500 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors"
            >
              Return to overview
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white/80 antialiased">
      {/* Extremely subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.03),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-16 md:py-24 lg:py-32">
        {/* Very discreet metadata line – appears only on hover/focus */}
        <div className="group mb-16 opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{fatwa.category || "General guidance"}</span>
            <div className="flex items-center gap-4">
              <span>{fatwa.date || "—"}</span>
              <span aria-hidden="true">·</span>
              <span>{(fatwa.views ?? 0).toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Core content – extremely calm & focused */}
        <article className="prose prose-slate prose-headings:font-medium prose-headings:tracking-tight max-w-none">
          {/* Title – large but restrained */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 leading-[1.15] mb-12">
            {fatwa.title}
          </h1>

          {/* Question – treated as a calm prompt */}
          <div className="mb-16">
            <div className="text-lg font-medium text-slate-700 mb-4">Question</div>
            <div className="text-xl leading-relaxed text-slate-800">
              {fatwa.question}
            </div>
          </div>

          {/* Answer – most important part, generous spacing */}
          <div className="text-[1.05rem] leading-[1.85] text-slate-800">
            {fatwa.answer?.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-10 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Source – very subdued, bottom right aligned */}
          {fatwa.source && (
            <div className="mt-24 text-right">
              <p className="text-sm text-slate-500 italic">
                Reference: {fatwa.source}
              </p>
            </div>
          )}
        </article>

        {/* Extremely discreet way back – bottom right, small text */}
        <div className="mt-32 text-right">
          <a
            href="/fatwa"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-4"
          >
            Back to all entries
          </a>
        </div>
      </main>
    </div>
  );
}