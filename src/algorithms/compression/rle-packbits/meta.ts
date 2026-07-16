// PackBits 风格 RLE · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rle-packbits',
  categoryId: 'compression',
  title: { zh: 'PackBits 风格 RLE', en: 'PackBits-style RLE' },
  summary: {
    zh: 'Apple PackBits：重复段与不重复段混合编码。',
    en: 'Apple PackBits: mixed encoding of runs and literal sequences.',
  },
  description: {
    zh: 'PackBits 用单字节头部区分两类段：头部 n∈[1,128] 表示「n 个 literal 原样复制」，n∈[129,255] 表示「-(n-256) 的相反数即 2..128 表示重复下一字节那么多次」。本实现把字节流编为 (header, payload...) 段序列。',
    en: 'PackBits uses a one-byte header to distinguish two segment kinds: header n∈[1,128] means "copy the next n bytes literally", header n∈[129,255] means "repeat the next byte (257-n) times" (i.e. 2..128). This implementation encodes a byte stream into a sequence of (header, payload...) segments.',
  },
  tags: ['compression', 'rle', 'lossless'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
