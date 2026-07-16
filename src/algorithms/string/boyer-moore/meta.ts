// Boyer-Moore · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'boyer-moore',
  categoryId: 'string',
  title: { zh: 'Boyer-Moore 匹配', en: 'Boyer-Moore' },
  summary: {
    zh: 'Boyer-Moore 匹配属于string类别。',
    en: 'Boyer-Moore is a string algorithm.',
  },
  description: {
    zh: 'Boyer-Moore 匹配（Boyer-Moore）属于string类别的算法。',
    en: 'Boyer-Moore is an algorithm in the string category.',
  },
  tags: ["string","string-matching"],
  complexity: { time: 'O(n/m) avg, O(n·m) worst', space: 'O(m + |Σ|)' },
};
