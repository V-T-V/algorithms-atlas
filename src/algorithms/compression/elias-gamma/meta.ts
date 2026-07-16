// Elias Gamma 编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'elias-gamma',
  categoryId: 'compression',
  title: { zh: 'Elias Gamma 编码', en: 'Elias Gamma Encoding' },
  summary: {
    zh: '正整数 n 编为 ⌊log2 n⌋ 个 0 后跟 n 的二进制。',
    en: 'Encodes positive integer n as ⌊log2 n⌋ zeros followed by the binary of n.',
  },
  description: {
    zh: 'Elias gamma 编码对正整数 n：先写 k = ⌊log2 n⌋ 个零，再写 n 的二进制表示（共 k+1 位，最高位必为 1）。解码时数前导零个数 k，再读 k+1 位即得 n。码长 = 2⌊log2 n⌋+1，对小数友好（1 只需 1 bit）。',
    en: 'Elias gamma encodes positive integer n by writing k = ⌊log2 n⌋ zeros, then the binary of n (k+1 bits, leading 1). To decode, count leading zeros k and read the next k+1 bits. Code length = 2⌊log2 n⌋+1, friendly to small numbers (1 takes just 1 bit).',
  },
  tags: ['compression', 'encoding', 'integer', 'prefix-code'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
