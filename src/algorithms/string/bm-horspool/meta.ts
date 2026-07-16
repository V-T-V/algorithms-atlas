// Boyer-Moore-Horspool · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bm-horspool',
  categoryId: 'string',
  title: { zh: 'Boyer-Moore-Horspool', en: 'Boyer-Moore-Horspool' },
  summary: {
    zh: 'Boyer-Moore-Horspool属于string类别。',
    en: 'Boyer-Moore-Horspool is a string algorithm.',
  },
  description: {
    zh: 'Boyer-Moore-Horspool（Boyer-Moore-Horspool）属于string类别的算法。',
    en: 'Boyer-Moore-Horspool is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n/m) avg, O(n·m) worst', space: 'O(|Σ|)' },
};
