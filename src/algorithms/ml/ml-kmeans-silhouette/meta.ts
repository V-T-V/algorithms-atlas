// 轮廓系数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-kmeans-silhouette',
  categoryId: 'ml',
  title: { zh: '轮廓系数', en: 'Silhouette Coefficient' },
  summary: {
    zh: '评估聚类质量：样本内聚度与分离度之差比。',
    en: 'Evaluate clustering: silhouette = (b-a)/max(a,b).',
  },
  description: {
    zh: 'a=同簇平均距离，b=最近他簇平均距离，s=(b-a)/max(a,b) ∈ [-1,1]。',
    en: 'a=mean intra-cluster distance, b=mean nearest-other-cluster distance; s=(b-a)/max(a,b).',
  },
  tags: ['ml', 'clustering', 'evaluation'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
