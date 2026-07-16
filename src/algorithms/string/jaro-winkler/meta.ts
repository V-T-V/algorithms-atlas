// Jaro-Winkler Similarity · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jaro-winkler',
  categoryId: 'string',
  title: { zh: 'Jaro-Winkler 相似度', en: 'Jaro-Winkler Similarity' },
  summary: {
    zh: 'Jaro-Winkler 相似度属于string类别。',
    en: 'Jaro-Winkler Similarity is a string algorithm.',
  },
  description: {
    zh: 'Jaro-Winkler 相似度（Jaro-Winkler Similarity）属于string类别的算法。',
    en: 'Jaro-Winkler Similarity is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n·m)', space: 'O(n+m)' },
};
