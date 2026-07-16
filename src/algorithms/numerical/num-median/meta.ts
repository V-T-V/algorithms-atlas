// 中位数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-median',
  categoryId: 'numerical',
  title: { zh: '中位数', en: 'Median' },
  summary: { zh: '计算数据集中位数。', en: 'Compute the median of a dataset.' },
  description: {
    zh: '排序后取中间（偶数取两中值平均）。',
    en: 'Sort, take middle (average of two middles for even length).',
  },
  tags: ['numerical', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
