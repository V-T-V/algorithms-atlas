// RLE v3（Run-Length Encoding v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-rle-3',
  categoryId: 'compression',
  title: { zh: 'RLE v3', en: 'Run-Length Encoding v3' },
  summary: {
    zh: 'RLE v3：游程编码，含字面 run 优化。',
    en: 'RLE v3: run-length encoding with literal-run optimization.',
  },
  description: {
    zh: 'RLE v3 把连续相同字符编码为 (count, char)；当连续无重复字符达到阈值时输出「字面 run」避免膨胀。',
    en: 'RLE v3 encodes runs as (count, char); when consecutive non-repeating chars reach a threshold, emit a literal run to avoid bloat.',
  },
  tags: ['compression', 'rle', 'run-length'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
