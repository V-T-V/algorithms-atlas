// Elias Delta · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-elias-delta',
  categoryId: 'compression',
  title: { zh: 'Elias Delta 编码', en: 'Elias Delta Coding' },
  summary: {
    zh: '对正整数编码：先写 ⌊log2 n⌋ 的 Elias gamma，再写去掉最高位的二进制。',
    en: 'Encode positive integers: Elias gamma of floor(log2 n) followed by the binary without the leading 1.',
  },
  description: {
    zh: 'Elias delta 编码对正整数 n：\n\n1. 令 L = ⌊log2 n⌋，即 n 的二进制位数减 1。\n2. 写 L 的 Elias gamma 编码（L 个 0 + 1 + L 的二进制）。\n3. 写 n 去掉最高位后的 L 位二进制。\n\n比 Elias gamma 更省空间（对大数更优）。',
    en: 'Elias delta coding for positive integer n:\n\n1. Let L = floor(log2 n), i.e. bit length of n minus 1.\n2. Write the Elias gamma of L (L zeros + 1 + binary of L).\n3. Write the lower L bits of n (without its leading 1).\n\nMore compact than Elias gamma for larger numbers.',
  },
  tags: ['compression', 'entropy', 'prefix-free'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
