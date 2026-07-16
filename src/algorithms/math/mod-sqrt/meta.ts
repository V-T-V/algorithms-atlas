// Modular Sqrt · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mod-sqrt',
  categoryId: 'math',
  title: { zh: '模平方根 Tonelli–Shanks', en: 'Modular Sqrt' },
  summary: {
    zh: '模平方根 Tonelli–Shanks属于math类别。',
    en: 'Modular Sqrt is a math algorithm.',
  },
  description: {
    zh: '模平方根 Tonelli–Shanks（Modular Sqrt）属于math类别的算法。',
    en: 'Modular Sqrt is an algorithm in the math category.',
  },
  tags: ["math","range-query"],
  complexity: { time: 'O(log² p)', space: 'O(1)' },
};
