// 就近百分位（Nearest-Rank Percentile）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-percentile-nearest',
  categoryId: 'selection',
  title: { zh: '就近百分位', en: 'Nearest-Rank Percentile' },
  summary: {
    zh: '就近百分位：rank = ceil(p/100·n)，取排序后该位置。',
    en: 'Nearest-rank percentile: rank = ceil(p/100·n), take that sorted position.',
  },
  description: {
    zh: '就近排名百分位（Excel PERCENTILE.INC 的 nearest 变体）：rank = ceil(p/100·n)，直接取该位置值，不做插值。',
    en: 'Nearest-rank percentile (a variant of Excel PERCENTILE.INC): rank = ceil(p/100·n), take the value at that position without interpolation.',
  },
  tags: ['selection', 'percentile', 'statistics', 'nearest'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
