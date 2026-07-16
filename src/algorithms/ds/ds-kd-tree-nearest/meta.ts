// K-D 树最近邻 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-kd-tree-nearest',
  categoryId: 'ds',
  title: { zh: 'K-D 树最近邻搜索', en: 'K-D Tree Nearest Neighbor' },
  summary: {
    zh: '二维 K-D 树 + 剪枝搜索最近邻，平均 O(log n)。',
    en: '2D k-d tree with pruned nearest-neighbor search; average O(log n).',
  },
  description: {
    zh: 'K-D 树对二维点集递归按 x/y 轴交替中位数划分，建出平衡二叉树。最近邻查询时先深入一侧，再借助「到分割超平面的距离」决定是否需要回查另一侧，从而大幅剪枝。本实现提供建树 buildKdTree 与 nearest 查询（返回最近点及其距离）。区别于已有的 kd-tree。零 DOM 依赖。',
    en: 'A k-d tree recursively splits a 2D point set by alternating x/y median into a balanced tree. Nearest-neighbor first descends one side, then uses the distance to the splitting hyperplane to decide whether the other side must be searched, pruning heavily. Provides buildKdTree and nearest (returning the closest point and its distance). Distinct from the existing kd-tree. Zero DOM dependency.',
  },
  tags: ['ds', 'k-d-tree', 'nearest-neighbor', 'geometry'],
  complexity: { time: 'O(log n) avg build/query', space: 'O(n)' },
};
