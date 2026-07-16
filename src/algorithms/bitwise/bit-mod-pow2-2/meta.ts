// 2的幂取模v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-mod-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '2的幂取模v2', en: 'Modulo Power of Two v2' },
  summary: {
    zh: '用 x & (m-1) 替代 x % m（m 为2的幂）。',
    en: 'Replace x % m by x & (m-1) when m is a power of two.',
  },
  description: {
    zh: '当 m=2^k，x mod m 等于 x 的低 k 位，可用掩码 (m-1) 按位与求得，无除法。',
    en: 'When m=2^k, x mod m = x & (m-1), avoiding division. O(1).',
  },
  tags: ['bitwise', 'modulo', 'optimization'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
