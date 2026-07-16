// 2的幂乘法v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-mul-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '2的幂乘法v2', en: 'Multiply Power of Two v2' },
  summary: { zh: '用左移实现乘以 2 的幂。', en: 'Multiply by a power of two via left shift.' },
  description: {
    zh: 'x << k 等价于 x * 2^k（受 32 位环绕）。k 取 mod 32。',
    en: 'x << k equals x * 2^k (32-bit wraparound). O(1).',
  },
  tags: ['bitwise', 'multiplication', 'optimization'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
