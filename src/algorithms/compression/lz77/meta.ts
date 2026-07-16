// LZ77 Sliding Window · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lz77',
  categoryId: 'compression',
  title: { zh: 'LZ77 滑动窗口', en: 'LZ77 Sliding Window' },
  summary: {
    zh: 'LZ77 滑动窗口属于compression类别。',
    en: 'LZ77 Sliding Window is a compression algorithm.',
  },
  description: {
    zh: 'LZ77 滑动窗口（LZ77 Sliding Window）属于compression类别的算法。',
    en: 'LZ77 Sliding Window is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n·W·L)', space: 'O(W)' },
};
