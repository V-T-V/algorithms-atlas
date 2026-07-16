// DEFLATE v3（DEFLATE v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-deflate-3',
  categoryId: 'compression',
  title: { zh: 'DEFLATE v3', en: 'DEFLATE v3' },
  summary: {
    zh: 'DEFLATE：LZ77 + Huffman，gzip/zlib 内核。',
    en: 'DEFLATE: LZ77 + Huffman, the core of gzip/zlib.',
  },
  description: {
    zh: 'DEFLATE（Deutsch）= LZ77 + 哈夫曼编码，可选用固定或动态 Huffman 表。是 gzip、zlib、PNG 的内核。',
    en: 'DEFLATE (Deutsch) = LZ77 + Huffman coding, with fixed or dynamic Huffman tables; the core of gzip, zlib, and PNG.',
  },
  tags: ['compression', 'deflate', 'lz77', 'huffman', 'gzip'],
  complexity: { time: 'O(n·w)', space: 'O(w + tree)' },
};
