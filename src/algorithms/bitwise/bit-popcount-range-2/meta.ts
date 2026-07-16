// 区间popcount和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-popcount-range-2',
  categoryId: 'bitwise',
  title: { zh: '区间popcount和', en: 'Popcount Sum over Range' },
  summary: {
    zh: '求 [m, n] 内所有整数 popcount 之和。',
    en: 'Sum of popcount over all integers in [m, n].',
  },
  description: {
    zh: '暴力累加每个数的 popcount（教学用）。',
    en: 'Sum popcount of each integer in [m, n]. O((n-m) log n).',
  },
  tags: ['bitwise', 'popcount', 'range'],
  complexity: { time: 'O((n-m) log n)', space: 'O(1)' },
};
