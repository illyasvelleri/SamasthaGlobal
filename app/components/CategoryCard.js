import Link from 'next/link';

export function CategoryCard({ category }) {
  // You can later add real icons per category (emoji, heroicons, or SVG)
  const iconMap = {
    'നമസ്കാരം': '🕌',
    'നോമ്പ്': '🌙',
    'സകാത്ത്': '💰',
    'ഹജ്ജ്': '🕋',
    // Add more as you create categories
  };

  const icon = iconMap[category.name] || '📖';

  // You'll need to add a `fatwaCount` field or compute it — for now we fake it or leave 0
  const count = 0; // ← replace later with real count from aggregation or separate query

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col items-center p-6 text-center"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg text-islamic-primary group-hover:text-islamic-secondary transition">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {category.description}
        </p>
      )}
      <div className="mt-3 text-xs font-medium text-gray-400">
        {count} ഫത്വകൾ
      </div>
    </Link>
  );
}