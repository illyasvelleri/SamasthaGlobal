// components/ScrollButton.js
'use client';

export default function ScrollButton() {
  const handleScroll = () => {
    document.getElementById('platforms')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <button
      onClick={handleScroll}
      className="
        inline-flex items-center justify-center
        px-10 sm:px-14 py-5 sm:py-6
        text-lg sm:text-xl font-medium
        bg-stone-900 text-white
        rounded-full
        hover:bg-stone-950
        active:bg-stone-800
        transition-all duration-200
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-4 focus:ring-offset-stone-50
      "
    >
      Explore Samastha Universe
    </button>
  );
}