// Letter Combos · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'letter-combos',
  categoryId: 'backtracking',
  title: { zh: '电话号码字母组合', en: 'Letter Combos' },
  summary: {
    zh: '电话号码字母组合属于backtracking类别。',
    en: 'Letter Combos is a backtracking algorithm.',
  },
  description: {
    zh: '电话号码字母组合（Letter Combos）属于backtracking类别的算法。',
    en: 'Letter Combos is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
