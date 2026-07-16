// 2的幂除法v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-div-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '2的幂除法v2', en: 'Divide Power of Two v2' },
  summary: {
    zh: '用算术右移实现除以 2 的幂（向零取整）。',
    en: 'Signed divide by a power of two via arithmetic shift (round toward zero).',
  },
  description: {
    zh: 'x >> k 对正数即 x/2^k；对负数需修正偏置：先加 (2^k - 1) 再右移以实现向零取整。',
    en: 'For negatives add (2^k - 1) before >>k to round toward zero. O(1).',
  },
  tags: ['bitwise', 'division', 'optimization'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
