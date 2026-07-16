// LZSS · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lzss',
  categoryId: 'compression',
  title: { zh: 'LZSS 压缩', en: 'LZSS Compression' },
  summary: {
    zh: 'LZ77 改进版：用 1 位标志区分字面量与 (距离,长度) 指针，提升压缩率。',
    en: 'An LZ77 variant using a 1-bit flag to separate literals from (distance,length) pairs.',
  },
  description: {
    zh: 'LZSS 是 LZ77 的精简改进：\n\n- 把输出流分成若干「块」(block)，每块以 1 个标志字节开头，8 个标志位分别指示后续 8 个项是字面量(0)还是回引(1)。\n- 字面量：1 字节原始数据。回引：定长 (distance, length) 对。\n- 相比 LZ77 的变长输出，LZSS 解码更简单、压缩率更高，是 Deflate/LZX 等的基础。',
    en: 'LZSS refines LZ77:\n\n- The output is split into blocks, each starting with a 1-byte flag field; 8 flag bits indicate whether each of the next 8 items is a literal (0) or a back-reference (1).\n- Literal: 1 raw byte. Back-reference: a fixed-size (distance, length) pair.\n- Simpler to decode and better compression than variable-length LZ77; foundation for Deflate/LZX.',
  },
  tags: ['compression', 'dictionary', 'lossless'],
  complexity: { time: 'O(n·W)', space: 'O(n)' },
};
