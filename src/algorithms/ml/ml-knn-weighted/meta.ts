// 加权 KNN 分类 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-knn-weighted',
  categoryId: 'ml',
  title: { zh: '加权 KNN 分类', en: 'Distance-Weighted kNN' },
  summary: { zh: '按距离倒数加权投票的 KNN。', en: 'kNN with inverse-distance weighted voting.' },
  description: {
    zh: '近邻权重 = 1/d（或 1/d²），缓解少数离群近邻的影响。',
    en: 'Weight each neighbor by 1/d (or 1/d²) to reduce outlier influence.',
  },
  tags: ['ml', 'knn', 'classification'],
  complexity: { time: 'O(nd)', space: 'O(d)' },
};
