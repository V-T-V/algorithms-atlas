// Permutation Gen · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'permutation-generation',
  categoryId: 'recursion',
  title: { zh: '排列生成', en: 'Permutation Gen' },
  summary: {
    zh: '排列生成属于recursion类别。',
    en: 'Permutation Gen is a recursion algorithm.',
  },
  description: {
    zh: '排列生成（Permutation Gen）属于recursion类别的算法。',
    en: 'Permutation Gen is an algorithm in the recursion category.',
  },
  tags: ["recursion","backtracking"],
  complexity: { time: 'O(n · n!)', space: 'O(n)' },
};
