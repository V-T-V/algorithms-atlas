// LZO 风格压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lzo',
  categoryId: 'compression',
  title: { zh: 'LZO 风格压缩', en: 'LZO-style Compression' },
  summary: {
    zh: 'LZO 风格的快速 LZ 压缩（简化版）。',
    en: 'A simplified LZO-style fast LZ compressor.',
  },
  description: {
    zh: 'LZO 以「解压极快、压缩比适中」著称。本简化版采用固定大小的滑动窗口与最小匹配长度，输出 literal 段与 (distance, length) 匹配段；其思想与 LZ77/RLE 临近，但更强调线性扫描的速度。',
    en: 'LZO is known for extremely fast decompression at a modest compression ratio. This simplified version uses a fixed sliding window and a minimum match length, emitting literal runs and (distance, length) match segments — close in spirit to LZ77/RLE but optimized for linear scanning speed.',
  },
  tags: ['compression', 'dictionary', 'lossless'],
  complexity: { time: 'O(n·W)', space: 'O(W)' },
};
