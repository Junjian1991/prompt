import bannedWords from '../data/banned_words.json';

export interface FilterResult {
  filteredText: string;
  hasExactMatch: boolean;
  hasFuzzyMatch: boolean;
  removedWords: string[];
}

export const filterBannedWords = (text: string): FilterResult => {
  const result: FilterResult = {
    filteredText: text,
    hasExactMatch: false,
    hasFuzzyMatch: false,
    removedWords: []
  };

  if (!text) return result;

  let filtered = text;
  const removed: string[] = [];

  bannedWords.exact_match.forEach(word => {
    if (text.includes(word)) {
      result.hasExactMatch = true;
      removed.push(word);
      filtered = filtered.replace(new RegExp(word, 'g'), '');
    }
  });

  result.filteredText = filtered.trim();
  result.removedWords = removed;

  bannedWords.fuzzy_match.forEach(word => {
    if (filtered.includes(word)) {
      result.hasFuzzyMatch = true;
    }
  });

  return result;
};

export const checkBannedWords = (text: string): { hasExact: boolean; hasFuzzy: boolean } => {
  const hasExact = bannedWords.exact_match.some(word => text.includes(word));
  const hasFuzzy = bannedWords.fuzzy_match.some(word => text.includes(word));
  return { hasExact, hasFuzzy };
};
