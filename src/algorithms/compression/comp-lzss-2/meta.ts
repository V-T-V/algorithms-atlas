// LZSS v2（LZSS v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lzss-2',
  categoryId: 'compression',
  title: { zh: 'LZSS v2', en: 'LZSS v2' },
  summary: {
    zh: 'LZSS：位标志 + (距离, 长度)，比 LZ77 更紧凑。',
    en: 'LZSS: bit flag + (distance, length); more compact than LZ77.',
  },
  description: {
    zh: 'LZSS（Storer & Szymanski）改进 LZ77：每个 token 前加 1 位标志（0=字面，1=匹配），匹配时不带 next 字符。',
    en: 'LZSS (Storer & Szymanski) improves LZ77: each token has a 1-bit flag (0=literal, 1=match); matches omit the next char.',
  },
  tags: ['compression', 'lzss', 'dictionary', 'sliding-window'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
