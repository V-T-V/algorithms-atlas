// 百分位数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-percentile',
  categoryId: 'numerical',
  title: { zh: '百分位数', en: 'Percentile' },
  summary: { zh: '计算数据集的第 p 百分位数。', en: 'Compute the p-th percentile of a dataset.' },
  description: {
    zh: '排序后按线性插值法取第 p 百分位。',
    en: 'Sort then linear-interpolate to the p-th percentile.',
  },
  tags: ['numerical', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
