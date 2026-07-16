// 4位反转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-reverse-3',
  categoryId: 'bitwise',
  title: { zh: '4位反转', en: 'Nibble Bit-Reversal' },
  summary: { zh: '对 4 位组的二进制做位序反转。', en: 'Reverse the bit order of a 4-bit value.' },
  description: {
    zh: '用掩码交错交换：先交换相邻 2 位，再交换相邻 1 位。0b1010 → 0b0101。',
    en: 'Swap adjacent bits then adjacent pairs: nibble 0b1010 -> 0b0101. O(1).',
  },
  tags: ['bitwise', 'reverse', 'nibble'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
