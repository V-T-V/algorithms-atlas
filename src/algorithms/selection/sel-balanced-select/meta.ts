// 平衡选择（Balanced Select）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-balanced-select',
  categoryId: 'selection',
  title: { zh: '平衡选择', en: 'Balanced Select' },
  summary: {
    zh: '平衡快速选择：保证两侧较均衡递归。',
    en: 'Balanced quickselect: ensures both sides recurse evenly.',
  },
  description: {
    zh: '平衡选择在每次划分后选较小一侧先递归（尾递归消除），栈深度 O(log n)。',
    en: 'Balanced select recurses into the smaller side first (tail-call elimination), giving O(log n) stack depth.',
  },
  tags: ['selection', 'quickselect', 'balanced', 'tail-recursion'],
  complexity: { time: 'O(n) expected', space: 'O(log n)' },
};
