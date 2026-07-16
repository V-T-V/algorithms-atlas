// 交换半字节v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-swap-nibbles-2',
  categoryId: 'bitwise',
  title: { zh: '交换半字节v2', en: 'Swap Nibbles v2' },
  summary: {
    zh: '交换一个字节的高 4 位与低 4 位。',
    en: 'Swap the upper and lower nibble of a byte.',
  },
  description: {
    zh: '((x & 0x0F) << 4) | ((x & 0xF0) >> 4)。',
    en: 'Swap the two nibbles of a byte. O(1).',
  },
  tags: ['bitwise', 'nibble', 'swap'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
