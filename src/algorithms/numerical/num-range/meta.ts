// 极差 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-range',
  categoryId: 'numerical',
  title: { zh: '极差', en: 'Range' },
  summary: { zh: '计算数据集最大值与最小值之差。', en: 'Difference between max and min.' },
  description: { zh: 'range = max - min。', en: 'range = max - min.' },
  tags: ['numerical', 'statistics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
