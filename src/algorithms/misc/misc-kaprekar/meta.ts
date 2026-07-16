// 卡布列克数（Kaprekar Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-kaprekar',
  categoryId: 'misc',
  title: { zh: '卡布列克数', en: 'Kaprekar Number' },
  summary: {
    zh: '平方后分成两段相加等于原数，如 9²=81, 8+1=9。',
    en: 'Square splits into two parts that sum to the original, e.g. 9²=81, 8+1=9.',
  },
  description: {
    zh: '卡布列克数：n² 分成左右两段 r 和 l，r+l=n（r 可为 0 但不能全 0）。如 45²=2025, 20+25=45。',
    en: 'Kaprekar: n² split into right r and left l with r+l=n (r may be 0 but not all zero). E.g. 45²=2025.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
