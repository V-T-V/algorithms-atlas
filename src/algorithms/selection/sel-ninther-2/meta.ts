// Ninther v2（Ninther v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-ninther-2',
  categoryId: 'selection',
  title: { zh: 'Ninther v2', en: 'Ninther v2' },
  summary: {
    zh: 'Ninther：3 个 median-of-3 的中位数，做更稳的 pivot。',
    en: 'Ninther: median of three median-of-3s, a more stable pivot.',
  },
  description: {
    zh: 'Ninther（Tukey）从 9 个元素中选 pivot：分 3 组各取 median-of-3，再取这 3 个的中位数。比 median-of-3 更稳，仍是 O(1)。',
    en: 'Ninther (Tukey) picks a pivot from 9 elements: 3 median-of-3s, then median of those 3. More stable than median-of-3 while still O(1).',
  },
  tags: ['selection', 'pivot', 'ninther', 'median-of-3'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
