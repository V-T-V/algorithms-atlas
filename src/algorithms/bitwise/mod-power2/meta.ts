// 位运算模 2^n · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mod-power2',
  categoryId: 'bitwise',
  title: { zh: '位运算模 2^n', en: 'Modulo Power of Two' },
  summary: {
    zh: 'x mod 2^n = x & (2^n - 1)，无除法。',
    en: 'x mod 2^n = x & (2^n - 1), division-free.',
  },
  description: {
    zh: '当模数是 2 的幂（n=2^k）时，取模可用掩码替代除法：x mod n = x & (n - 1)。因为 2^k 的二进制只有一位 1，n-1 是低 k 位全 1，按位与恰好保留 x 的低 k 位，即余数。这是位运算里最常见的优化之一（哈希表取桶、环形缓冲索引）。',
    en: 'When the modulus is a power of two (n = 2^k), modulo can replace division with a bitmask: x mod n = x & (n - 1). Since 2^k has a single 1-bit, n-1 has its low k bits all 1, and ANDing keeps exactly the low k bits of x — the remainder. One of the most common bit-trick optimizations (hash bucketing, ring buffer indexing).',
  },
  tags: ['bitwise', 'modulo', 'optimization'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
