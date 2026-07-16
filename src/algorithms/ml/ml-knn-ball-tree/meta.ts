// 球树 KNN · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-knn-ball-tree',
  categoryId: 'ml',
  title: { zh: '球树 KNN', en: 'Ball Tree kNN' },
  summary: { zh: '用球树结构加速 KNN 查询。', en: 'Accelerate kNN queries using a ball tree.' },
  description: {
    zh: '递归把点集按最远方向分裂，每个节点记录球心与半径，查询时剪枝。',
    en: 'Recursively split points along the spread direction; each node stores center+radius for pruning.',
  },
  tags: ['ml', 'knn', 'tree'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
