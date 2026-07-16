// 位交错v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-interleave-2',
  categoryId: 'bitwise',
  title: { zh: '位交错v2', en: 'Bit Interleave (Morton) v2' },
  summary: {
    zh: '把两个 16 位整数交错成 32 位（Morton 码）。',
    en: 'Interleave bits of two 16-bit values into a 32-bit Morton code.',
  },
  description: {
    zh: '用掩码 + 移位的「扩散」逐级把 x 与 y 的位铺开，再合并。常用于空间索引（Z 序）。',
    en: 'Spread-and-merge to interleave bits (Z-order curve). O(log bits).',
  },
  tags: ['bitwise', 'morton', 'interleave'],
  complexity: { time: 'O(log bits)', space: 'O(1)' },
};
