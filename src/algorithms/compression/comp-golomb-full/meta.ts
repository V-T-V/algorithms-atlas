// Golomb 编码（完整）（Golomb Coding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-golomb-full',
  categoryId: 'compression',
  title: { zh: 'Golomb 编码（完整）', en: 'Golomb Coding' },
  summary: {
    zh: '几何分布整数的最优前缀码。',
    en: 'Optimal prefix code for geometric distribution.',
  },
  description: {
    zh: 'Golomb 编码用参数 m 把整数 n 编为一元商 ⌊n/m⌋ + 截断余数，对几何分布接近熵下界，rice 是 m=2^k 特例。',
    en: 'Golomb coding with parameter m encodes n as a unary quotient and truncated remainder; near-entropy for geometric distributions (Rice is m=2^k).',
  },
  tags: ['compression', 'golomb', 'prefix-code'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
