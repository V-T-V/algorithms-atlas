// 混淆矩阵 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-confusion-matrix',
  categoryId: 'ml',
  title: { zh: '混淆矩阵', en: 'Confusion Matrix' },
  summary: { zh: '统计预测 vs 真实标签的方阵。', en: 'Square matrix of predicted vs true labels.' },
  description: {
    zh: 'C[i][j] = 真实 i 被预测为 j 的样本数。',
    en: 'C[i][j] = count of true i predicted as j.',
  },
  tags: ['ml', 'evaluation'],
  complexity: { time: 'O(n)', space: 'O(k^2)' },
};
