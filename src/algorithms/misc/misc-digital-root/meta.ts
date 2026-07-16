// 数根（Digital Root）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-digital-root',
  categoryId: 'misc',
  title: { zh: '数根', en: 'Digital Root' },
  summary: {
    zh: '反复求数字和直到一位，等价于 n mod 9（特殊处理 9 的倍数）。',
    en: 'Iteratively sum digits to one digit; equals n mod 9 (with multiples of 9 giving 9).',
  },
  description: {
    zh: '数根：dr(n) = n===0?0 : 1+((n-1) mod 9)。是 n 对 9 取模的映射（0 映射为 9）。',
    en: 'Digital root: dr(n) = n===0?0 : 1+((n-1) mod 9). Maps n mod 9 (0->9).',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
