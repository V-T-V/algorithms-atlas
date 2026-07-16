// Z-Score 标准化 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-z-score-scale',
  categoryId: 'ml',
  title: { zh: 'Z-Score 标准化', en: 'Z-Score Standardization' },
  summary: { zh: '把特征化为均值 0、方差 1。', en: 'Standardize features to mean 0, variance 1.' },
  description: { zh: 'z=(x-μ)/σ。', en: 'z=(x-μ)/σ.' },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
