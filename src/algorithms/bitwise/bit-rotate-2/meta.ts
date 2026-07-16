// 循环移位v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-rotate-2',
  categoryId: 'bitwise',
  title: { zh: '循环移位v2', en: 'Bitwise Rotate v2' },
  summary: {
    zh: '32 位循环左/右移位，溢出位回填到另一端。',
    en: '32-bit rotation (rotl/rotr) wrapping overflow to the other end.',
  },
  description: {
    zh: '左移 r 位：rotl = (x << r) | (x >>> (32-r))；右移类似。r 取 mod 32。',
    en: 'rotl(x,r) = (x<<r)|(x>>>(32-r)); rotr symmetric. O(1).',
  },
  tags: ['bitwise', 'rotate', 'rotl'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
