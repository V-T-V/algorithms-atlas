// Ternary Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ternary-search-real',
  categoryId: 'math',
  title: { zh: '三分查找（实数版）', en: 'Ternary Search (Real-valued)' },
  summary: {
    zh: '三分查找属于math类别。',
    en: 'Ternary Search is a math algorithm.',
  },
  description: {
    zh: '三分查找（Ternary Search）属于math类别的算法。',
    en: 'Ternary Search is an algorithm in the math category.',
  },
  tags: ["math","searching"],
  complexity: { time: 'O(log((hi−lo)/eps))', space: 'O(1)' },
};
