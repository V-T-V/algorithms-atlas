// Golomb-Rice · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-golomb-rice',
  categoryId: 'compression',
  title: { zh: 'Golomb-Rice 联合编码', en: 'Golomb-Rice Coding' },
  summary: {
    zh: 'Golomb 当参数 m=2^k 的特例：商用一元码、余数用 k 位二进制。',
    en: 'Golomb with m=2^k: quotient in unary, remainder in k binary bits.',
  },
  description: {
    zh: 'Golomb-Rice 是 Golomb 编码的高效特例（参数为 2 的幂）：\n\n- 给定参数 k（m=2^k），对非负整数 n：\n  - 商 q = n >> k，编码为 q 个 1 + 一个 0（一元码）。\n  - 余数 r = n & (m-1)，编码为 k 位二进制。\n- 当几何分布的参数 p 接近最优时，接近熵界。',
    en: 'Golomb-Rice is the efficient special case of Golomb coding (parameter is a power of two):\n\n- Given k (m=2^k), for non-negative n:\n  - Quotient q = n >> k, encoded as q ones + a zero (unary).\n  - Remainder r = n & (m-1), encoded as k binary bits.\n- Near-optimal for geometric distributions.',
  },
  tags: ['compression', 'entropy', 'prefix-free'],
  complexity: { time: 'O(n/m)', space: 'O(log n)' },
};
