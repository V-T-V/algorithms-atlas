// LZ4 v2（LZ4 v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lz4-2',
  categoryId: 'compression',
  title: { zh: 'LZ4 v2', en: 'LZ4 v2' },
  summary: {
    zh: 'LZ4：块级匹配，匹配长度 4 字节起，吞吐高。',
    en: 'LZ4: block matches with min length 4, high throughput.',
  },
  description: {
    zh: 'LZ4（Collet）面向速度：最小匹配 4 字节，token = (literal_len, match_len, distance)，literals 优先批量输出。',
    en: 'LZ4 (Collet) is speed-oriented: min match 4 bytes; token = (literal_len, match_len, distance); literals are batched.',
  },
  tags: ['compression', 'lz4', 'dictionary', 'fast'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
