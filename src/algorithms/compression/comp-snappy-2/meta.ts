// Snappy v2（Snappy v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-snappy-2',
  categoryId: 'compression',
  title: { zh: 'Snappy v2', en: 'Snappy v2' },
  summary: {
    zh: 'Snappy：Google 高速压缩，不追求最佳压缩比。',
    en: 'Snappy: Google high-speed compression, not aiming for best ratio.',
  },
  description: {
    zh: 'Snappy（Google）面向极高速压缩/解压：使用简单 tag + varint 长度 + copy 指令。匹配 ≥4 字节。',
    en: 'Snappy (Google) targets very high speed: simple tags + varint lengths + copy operations; min match 4 bytes.',
  },
  tags: ['compression', 'snappy', 'fast', 'google'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
