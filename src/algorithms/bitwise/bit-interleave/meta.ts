// 位交错 (Morton/Z-order) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-interleave',
  categoryId: 'bitwise',
  title: { zh: '位交错 (Morton/Z-order)', en: 'Bit Interleave (Morton / Z-order)' },
  summary: {
    zh: '把 x、y 的位交错成一个数（Morton 码）。',
    en: 'Interleave the bits of x and y into a single Morton code.',
  },
  description: {
    zh: 'Morton 码（Z-order 编码）把两个整数的二进制位交错排列：result 的偶数位取自 x，奇数位取自 y。这样 (x,y) 平面上相邻的格子在 1 维序列里也接近，常用于空间索引（R-tree、四叉树）。本实现用「Magic Bits」二分扩散法在 O(log w) 次字运算内完成 16 位输入的交错。',
    en: 'The Morton code (Z-order encoding) interleaves the bits of two integers: even bits of the result come from x, odd bits from y. This keeps 2D-adjacent cells close in the 1D sequence and is used for spatial indexing (R-tree, quadtree). This implementation uses the "Magic Bits" binary-spreading method to interleave 16-bit inputs in O(log w) word operations.',
  },
  tags: ['bitwise', 'morton', 'spatial'],
  complexity: { time: 'O(log w)', space: 'O(1)' },
};
