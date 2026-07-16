// 区间按位或v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-or-range-2',
  categoryId: 'bitwise',
  title: { zh: '区间按位或v2', en: 'Bitwise OR of Range v2' },
  summary: { zh: '求 [m, n] 内所有整数的按位或。', en: 'Bitwise OR of all integers in [m, n].' },
  description: {
    zh: '从低到高：只要 m 与 n 不等的位段，期间必然出现过 1，结果该段全为 1。等价于 m | (m+1) | ... | n 的公共填充。',
    en: 'OR over a range fills the gap bits between m and n with 1s. O(log n).',
  },
  tags: ['bitwise', 'range', 'or'],
  complexity: { time: 'O(log bits)', space: 'O(1)' },
};
