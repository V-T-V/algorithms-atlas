// 区间按位与v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-and-range-2',
  categoryId: 'bitwise',
  title: { zh: '区间按位与v2', en: 'Bitwise AND of Range v2' },
  summary: { zh: '求 [m, n] 内所有整数的按位与。', en: 'Bitwise AND of all integers in [m, n].' },
  description: {
    zh: '当 m<n 时，最低位必然出现过 0 与 1，按位与后该位为 0；右移 m,n 直到相等，再左移补回。',
    en: 'AND over a range: shared prefix of m and n. O(log n).',
  },
  tags: ['bitwise', 'range', 'and'],
  complexity: { time: 'O(log bits)', space: 'O(1)' },
};
