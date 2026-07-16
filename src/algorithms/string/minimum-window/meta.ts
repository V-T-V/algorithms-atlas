// Minimum Window Substring · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimum-window',
  categoryId: 'string',
  title: { zh: '最小覆盖子串', en: 'Minimum Window Substring' },
  summary: {
    zh: '最小覆盖子串属于string类别。',
    en: 'Minimum Window Substring is a string algorithm.',
  },
  description: {
    zh: '最小覆盖子串（Minimum Window Substring）属于string类别的算法。',
    en: 'Minimum Window Substring is an algorithm in the string category.',
  },
  tags: ["string","game-theory"],
  complexity: { time: 'O(|s| + |t|)', space: 'O(|Σ|)' },
};
