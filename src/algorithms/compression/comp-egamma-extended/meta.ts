// 扩展 Elias Gamma · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-egamma-extended',
  categoryId: 'compression',
  title: { zh: '扩展 Elias Gamma', en: 'Extended Elias Gamma' },
  summary: {
    zh: '支持零与负数：先写符号/零标志，再对绝对值做 Elias gamma。',
    en: 'Supports zero and negatives: emit a sign/zero flag, then Elias gamma of the absolute value.',
  },
  description: {
    zh: '扩展 Elias gamma 编码在标准 gamma（仅正整数）基础上支持零和负数：\n\n- 前缀 2 位标志：00 = 零，01 = 正，10 = 负。\n- 非零时，对 |n| 做标准 Elias gamma（(L 个 0) + 1 + L 位）。\n- 标准 gamma：L = ⌊log2 n⌋，输出 L 个 0，再输出 (L+1) 位的 n。',
    en: 'Extended Elias gamma extends standard gamma (positive integers only) to zero and negatives:\n\n- 2-bit flag prefix: 00 = zero, 01 = positive, 10 = negative.\n- When non-zero, apply standard Elias gamma to |n|: L zeros then (L+1) bits of n.\n- Standard gamma: L = floor(log2 n), emit L zeros, then (L+1)-bit n.',
  },
  tags: ['compression', 'entropy', 'prefix-free'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
