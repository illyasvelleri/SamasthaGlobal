export function getRecommendedFatwas(currentFatwa, allFatwas, limit = 5) {
  if (!currentFatwa) return [];

  const scores = allFatwas
    .filter(f => f._id.toString() !== currentFatwa._id.toString())
    .map(fatwa => {
      let score = 0;

      // Same category → +4
      if (fatwa.category === currentFatwa.category) score += 4;

      // Shared tags → +1 per shared tag
      const sharedTags = fatwa.tags?.filter(tag => currentFatwa.tags?.includes(tag)) || [];
      score += sharedTags.length;

      // Views bonus (popularity)
      score += Math.min(fatwa.views / 50, 3);

      return { fatwa, score };
    });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.fatwa);
}