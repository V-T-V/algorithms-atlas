// Jaro Similarity · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jaro',
  categoryId: 'string',
  title: { zh: 'Jaro 相似度', en: 'Jaro Similarity' },
  summary: {
    zh: 'Jaro 相似度属于string类别。',
    en: 'Jaro Similarity is a string algorithm.',
  },
  description: {
    zh: 'Jaro 相似度（Jaro Similarity）属于string类别的算法。',
    en: 'Jaro Similarity is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n·m)', space: 'O(n+m)' },
};
