// Word Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'word-search',
  categoryId: 'backtracking',
  title: { zh: '单词搜索', en: 'Word Search' },
  summary: {
    zh: '单词搜索属于backtracking类别。',
    en: 'Word Search is a backtracking algorithm.',
  },
  description: {
    zh: '单词搜索（Word Search）属于backtracking类别的算法。',
    en: 'Word Search is an algorithm in the backtracking category.',
  },
  tags: ["backtracking","searching"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
