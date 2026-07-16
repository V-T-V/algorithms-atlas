// 众数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-mode',
  categoryId: 'numerical',
  title: { zh: '众数', en: 'Mode' },
  summary: { zh: '计算数据集众数。', en: 'Compute the mode of a dataset.' },
  description: {
    zh: '出现次数最多的值（可能有多个）。',
    en: 'Most frequent value(s); may be multiple.',
  },
  tags: ['numerical', 'statistics'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
