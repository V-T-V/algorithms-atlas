// 字节序反转v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-reverse-bytes-2',
  categoryId: 'bitwise',
  title: { zh: '字节序反转v2', en: 'Reverse Byte Order v2' },
  summary: {
    zh: '交换 32 位整数的 4 个字节顺序（端序翻转）。',
    en: 'Swap the four bytes of a 32-bit integer (endianness flip).',
  },
  description: {
    zh: '通过掩码 + 移位交换字节：((x&0xFF)<<24)|((x&0xFF00)<<8)|((x>>>8)&0xFF00)|(x>>>24)。',
    en: 'Swap four bytes via masks and shifts. O(1).',
  },
  tags: ['bitwise', 'endian', 'byteswap'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
