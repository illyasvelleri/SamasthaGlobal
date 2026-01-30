import Link from "next/link";
import { getFatwaData } from "@/lib/data";

const FatwaCard = ({ fatwa }) => {
  return (
    <Link
      href={`/fatwa/${fatwa.id}`}
      className="group block rounded-3xl bg-white/60 backdrop-blur-md border border-white/70 p-6 hover:bg-white/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
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
      <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
        {fatwa.title}
      </h3>

      {/* Question + Excerpt */}
      <div className="space-y-2 mb-5">
        <p className="text-sm font-semibold text-emerald-800">ചോദ്യം:</p>
        <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
          {fatwa.question}
        </p>
        <p className="text-sm text-slate-500 line-clamp-2 italic">
          {fatwa.excerpt}
        </p>
      </div>

      {/* Footer action */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-emerald-600 font-medium group-hover:underline">
          വായിക്കുക →
        </span>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
    </Link>
  );
};

export default function FatwasPage() {
  // Fetch data from JSON file
  const { categories = [], fatwas = [] } = getFatwaData();

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-x-hidden pb-24 md:pb-12">
      
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <main className="pt-8 md:pt-12">
        
        {/* Page Header */}
        <section className="px-5 sm:px-8 lg:px-12 py-10 md:py-16 text-center">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm">
              <span className="text-lg">📖</span>
              <span className="text-sm font-semibold text-slate-700">ഫത്വ ശേഖരം</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              എല്ലാ ഫത്വകളും
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-2">
                ഒരിടത്ത്
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              ആധികാരിക ഇസ്‌ലാമിക പണ്ഡിതോപദേശങ്ങൾ തിരയുക, വായിക്കുക, പഠിക്കുക.
            </p>
          </div>
        </section>

        {/* Category Pills */}
        <section className="px-5 sm:px-8 lg:px-12 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`group px-5 py-2.5 rounded-full bg-gradient-to-r ${cat.gradient} text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Fatwas Grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Filters & Search (static for now) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                എല്ലാ ഫത്വകളും
              </h2>

              <div className="flex flex-wrap gap-3">
                <select className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>പുതിയത് ആദ്യം</option>
                  <option>ഏറ്റവും കൂടുതൽ കാണപ്പെട്ടത്</option>
                  <option>പഴയത് ആദ്യം</option>
                </select>

                <input
                  type="text"
                  placeholder="തിരയുക (ഉദാ: നോമ്പ്, സകാത്ത്...)"
                  className="px-5 py-2.5 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[260px]"
                />
              </div>
            </div>

            {/* Grid of Fatwa Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fatwas.map((fatwa) => (
                <FatwaCard key={fatwa.id} fatwa={fatwa} />
              ))}
            </div>

            {/* Load more button */}
            <div className="text-center mt-12">
              <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                കൂടുതൽ കാണിക്കൂ
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 backdrop-blur-sm bg-white/40 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-600">
          <p>© 2024 Fatwa Navigator • സമസ്ത കേരള ജംഇയ്യത്ത്</p>
        </div>
      </footer>
    </div>
  );
}