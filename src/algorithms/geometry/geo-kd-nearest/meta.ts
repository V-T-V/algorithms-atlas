// KD-Tree 最近邻 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-kd-nearest',
  categoryId: 'geometry',
  title: { zh: 'KD-Tree 最近邻', en: 'KD-Tree Nearest Neighbor' },
  summary: {
    zh: '用 2D KD-Tree 做最近邻查询，平均 O(log n)。',
    en: 'Nearest-neighbor query on a 2D KD-Tree, average O(log n).',
  },
  description: {
    zh: 'KD-Tree（k-dimensional tree）按维度轮流（x/y）对点集做中位数划分，构造二叉树。最近邻查询：\n\n1. 从根递归到目标所在子树，记录当前最近点\n2. 回溯时检查另一子树是否可能更近（以分裂超平面距离为界）\n3. 若可能则递归另一子树\n\n平均 O(log n)，最坏 O(n)（点分布退化时）。是高维近邻查询、KNN 的经典结构。',
    en: 'A KD-Tree partitions points by alternating axes (x/y) at the median. Nearest-neighbor query recurses into the target-side subtree, then backtracks and visits the other subtree only if it could hold a closer point (bounded by the splitting hyperplane distance). Average O(log n), worst O(n). Classic for high-dimensional NN and KNN.',
  },
  tags: ['geometry', 'kd-tree', 'nearest-neighbor', 'spatial-index'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
