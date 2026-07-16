// R 树（矩形范围查询）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-r-tree-range',
  categoryId: 'ds',
  title: { zh: 'R 树（最小外接矩形，范围查询）', en: 'R-Tree (Bounding Rectangles, Range Query)' },
  summary: {
    zh: '用最小外接矩形（MBR）聚合子节点，支持二维矩形范围查询。',
    en: 'Aggregates children by minimum bounding rectangles (MBR); 2D rectangular range query.',
  },
  description: {
    zh: 'R 树是一种平衡多路树：每个内部节点的条目存储「子树的最小外接矩形 MBR + 子指针」，叶子存储实际数据矩形。范围查询时通过 MBR 相交测试快速剪枝。本实现提供批量加载（按 x 中心排序后递归分组）与矩形范围查询，返回相交的数据项。区别于已有的 r-tree。零 DOM 依赖。',
    en: 'An R-tree is a balanced multi-way tree: each internal entry stores the MBR of its subtree plus a child pointer; leaves store actual data rectangles. Range query prunes via MBR intersection tests. Provides bulk loading (sort by x-center, recursively group) and rectangular range query returning intersecting items. Distinct from the existing r-tree. Zero DOM dependency.',
  },
  tags: ['ds', 'r-tree', 'spatial', 'mbr', 'range-query'],
  complexity: { time: 'O(log n + k) avg query', space: 'O(n)' },
};
