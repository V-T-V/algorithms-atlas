// 四叉树（二维矩形区域查询）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-quad-tree-range',
  categoryId: 'ds',
  title: { zh: '四叉树（二维矩形区域查询）', en: 'Quad Tree (2D Rectangular Range Query)' },
  summary: {
    zh: '把二维平面递归四等分，支持矩形范围内点查询 O(√n) 量级。',
    en: 'Recursively quarter the 2D plane; rectangular range query over points in ~O(√n).',
  },
  description: {
    zh: '四叉树把平面沿 x、y 中点递归划分为四个象限，直到每个叶子区域内的点数低于阈值。区域查询时：若查询矩形完全包含当前区域，整棵子树直接累加；若完全不交则跳过；否则递归四象限。本实现演示插入与矩形范围查询。区别于已有的 quad-tree。零 DOM 依赖。',
    en: 'A quad tree recursively splits the plane by x/y midpoints into four quadrants until each leaf holds fewer than a threshold of points. Range query: if the query rectangle fully contains the region, aggregate the whole subtree; if disjoint, skip; otherwise recurse into four quadrants. Demonstrates insert and rectangular range query. Distinct from the existing quad-tree. Zero DOM dependency.',
  },
  tags: ['ds', 'quad-tree', 'spatial', 'range-query', 'geometry'],
  complexity: { time: 'O(√n) avg query', space: 'O(n)' },
};
