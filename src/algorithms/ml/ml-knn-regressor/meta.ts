// KNN 回归 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-knn-regressor',
  categoryId: 'ml',
  title: { zh: 'KNN 回归', en: 'k-Nearest Neighbors Regression' },
  summary: {
    zh: '用 k 个最近邻目标值的均值做回归预测。',
    en: 'Predict via average of k nearest neighbors target values.',
  },
  description: {
    zh: '对查询点找出欧氏距离最近的 k 个训练样本，取其目标值平均作为预测。',
    en: 'Find k nearest training samples by Euclidean distance; predict the mean of their targets.',
  },
  tags: ['ml', 'knn', 'regression'],
  complexity: { time: 'O(nd)', space: 'O(d)' },
};
