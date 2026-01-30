export function FatwaCard({ fatwa, variant = 'default' }) {
  const isTrending = variant === 'trending';
  const isRecent   = variant === 'recent';

  return (
    <div
      className={`
        group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl 
        transition-all duration-300 border border-gray-100
        ${isTrending ? 'ring-2 ring-islamic-accent/40 hover:ring-islamic-accent/70' : ''}
      `}
    >
      <div className="p-5 md:p-6">
        <h3 className={`
          font-bold mb-3 line-clamp-2 leading-tight
          ${isTrending ? 'text-xl text-islamic-primary' : 'text-lg'}
        `}>
          {fatwa.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base">
          {fatwa.question?.substring(0, 140) || fatwa.answer?.substring(0, 140)}...
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {fatwa.tags?.slice(0, isTrending ? 4 : 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-islamic-secondary/10 text-islamic-secondary text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{fatwa.category}</span>
          {isTrending && (
            <span className="font-medium text-islamic-accent">
              {fatwa.views || 0} കാഴ്ചകൾ
            </span>
          )}
        </div>

        <div className="mt-5">
          <span className="inline-flex items-center text-islamic-primary font-medium group-hover:text-islamic-secondary transition">
            വായിക്കുക <span className="ml-2 group-hover:translate-x-1 transition">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}