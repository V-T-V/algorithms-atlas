// 线性插值百分位（Linear-Interpolation Percentile）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-percentile-linear',
  categoryId: 'selection',
  title: { zh: '线性插值百分位', en: 'Linear-Interpolation Percentile' },
  summary: {
    zh: '线性插值百分位：rank = p/100·(n−1)，相邻值线性插值。',
    en: 'Linear-interpolation percentile: rank = p/100·(n−1), linearly interpolate between neighbors.',
  },
  description: {
    zh: '线性插值百分位（numpy 默认）：排序后 rank = p/100·(n−1)，若非整数则取 floor/ceil 位置线性插值。',
    en: 'Linear-interpolation percentile (numpy default): after sorting, rank = p/100·(n−1); if non-integer, linearly interpolate between floor and ceil positions.',
  },
  tags: ['selection', 'percentile', 'statistics', 'interpolation'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
