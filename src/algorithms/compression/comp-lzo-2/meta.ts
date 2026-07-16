// LZO v2（LZO v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lzo-2',
  categoryId: 'compression',
  title: { zh: 'LZO v2', en: 'LZO v2' },
  summary: {
    zh: 'LZO：极快解压的块压缩，匹配用 RLE 前缀优化。',
    en: 'LZO: very fast block decompression; matches use RLE-prefix optimization.',
  },
  description: {
    zh: 'LZO（Oberhumer）优先解压速度：匹配长度用变长编码 + RLE 风格的 run-length 加速长 run。',
    en: 'LZO (Oberhumer) prioritizes decode speed: match lengths use variable-length encoding with RLE-style run acceleration.',
  },
  tags: ['compression', 'lzo', 'fast', 'block'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
