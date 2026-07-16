// 覆盖树 KNN · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-knn-cover-tree',
  categoryId: 'ml',
  title: { zh: '覆盖树 KNN', en: 'Cover Tree kNN' },
  summary: {
    zh: '用基于展开不变的覆盖树加速 KNN。',
    en: 'Accelerate kNN with an expansion-invariant cover tree.',
  },
  description: {
    zh: '覆盖树以层次距离分层，查询从粗到细，理论 O(log n)。',
    en: 'Layered by distances; query descends coarse-to-fine, theoretically O(log n).',
  },
  tags: ['ml', 'knn', 'tree'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
