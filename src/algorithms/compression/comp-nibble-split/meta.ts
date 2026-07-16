// Nibble 拆分编码（Nibble-Split Encoding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-nibble-split',
  categoryId: 'compression',
  title: { zh: 'Nibble 拆分编码', en: 'Nibble-Split Encoding' },
  summary: { zh: '4-bit 为单位紧凑存储整数。', en: 'Packs integers in 4-bit nibbles.' },
  description: {
    zh: 'Nibble 拆分将整数按 4 位半字节连续存储，前缀位指示是否续接，对小整数(如指针偏移)紧凑且易解码。',
    en: 'Nibble-split stores ints as 4-bit nibbles with a continuation bit; compact and simple for small offsets.',
  },
  tags: ['compression', 'nibble', 'varint'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
