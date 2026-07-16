// LZ 通用 v2（LZ Generic v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lz-2',
  categoryId: 'compression',
  title: { zh: 'LZ 通用 v2', en: 'LZ Generic v2' },
  summary: {
    zh: 'LZ 通用：滑动窗口 + 前看缓冲，输出 (距离, 长度) 二元组。',
    en: 'Generic LZ: sliding window + lookahead, emit (distance, length) pairs.',
  },
  description: {
    zh: 'LZ 通用 v2 输出 (distance, length) 二元组（不含 next 字符，与 LZ77 不同），用滑动窗口搜索最长匹配。',
    en: 'Generic LZ v2 emits (distance, length) pairs (without next char, unlike LZ77), searching the sliding window for the longest match.',
  },
  tags: ['compression', 'dictionary', 'lz', 'sliding-window'],
  complexity: { time: 'O(n·w)', space: 'O(w)' },
};
