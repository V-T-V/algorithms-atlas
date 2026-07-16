// ZigZag 编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'zigzag-encoding',
  categoryId: 'compression',
  title: { zh: 'ZigZag 编码', en: 'ZigZag Encoding' },
  summary: {
    zh: '有符号整数 → 无符号整数（小绝对值映射成小正数）。',
    en: 'Maps signed integers to unsigned ones (small magnitudes map to small positives).',
  },
  description: {
    zh: 'ZigZag 编码（protobuf 使用）把有符号整数交替映射到无符号：0→0, -1→1, 1→2, -2→3, 2→4 …。这样小绝对值（含负数）变成小无符号数，再用 varint 编码只需很少字节。编码 = (n << 1) ^ (n >> 63)（对 64 位），解码反之。',
    en: 'ZigZag encoding (used by protobuf) interleaves signed integers into unsigned: 0→0, -1→1, 1→2, -2→3, 2→4 … so that small magnitudes (including negatives) become small unsigned numbers, which varint then encodes in few bytes. Encode = (n << 1) ^ (n >> 63) (for 64-bit); decode inverts it.',
  },
  tags: ['compression', 'encoding', 'integer'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
