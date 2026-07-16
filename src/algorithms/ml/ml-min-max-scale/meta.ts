// Min-Max 归一化 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-min-max-scale',
  categoryId: 'ml',
  title: { zh: 'Min-Max 归一化', en: 'Min-Max Scaling' },
  summary: { zh: '把特征缩放到 [0,1]。', en: 'Scale features to [0,1].' },
  description: { zh: 'x′=(x-min)/(max-min)。', en: 'x′=(x-min)/(max-min).' },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
