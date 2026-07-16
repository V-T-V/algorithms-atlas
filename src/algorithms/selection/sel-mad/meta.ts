// 绝对中位差（Median Absolute Deviation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-mad',
  categoryId: 'selection',
  title: { zh: '绝对中位差', en: 'Median Absolute Deviation' },
  summary: {
    zh: 'MAD = median(|xᵢ − median|)，最稳健的离散度量。',
    en: 'MAD = median(|xᵢ − median|), the most robust spread measure.',
  },
  description: {
    zh: '绝对中位差（MAD）用中位数代替均值、绝对差代替平方差，对离群点极其稳健。常配合稳健 z-score 使用。',
    en: 'Median Absolute Deviation (MAD) replaces mean with median and squared deviation with absolute, extremely robust to outliers. Often used with robust z-scores.',
  },
  tags: ['selection', 'statistics', 'mad', 'robust', 'median'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
