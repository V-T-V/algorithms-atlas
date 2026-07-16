// 凸包面积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-convex-hull-area',
  categoryId: 'geometry',
  title: { zh: '凸包面积', en: 'Convex Hull Area' },
  summary: {
    zh: 'Andrew 单调链求凸包，再用鞋带公式算凸多边形面积。',
    en: "Andrew's monotone chain builds the convex hull, then the shoelace formula gives its area.",
  },
  description: {
    zh:
      '凸包面积（Convex Hull Area）：给定平面点集，先求凸包（包围所有点的最小凸多边形），再算其面积。' +
      '\n步骤：' +
      '\n1. 按 (x,y) 字典序排序所有点。' +
      '\n2. Andrew 单调链：分别构造下凸包与上凸包，合并去重得到按逆时针排列的凸包顶点。' +
      '\n3. 鞋带公式（Shoelace）：A = ½ · |Σ(x_i · y_{i+1} − x_{i+1} · y_i)|。' +
      '\n- 时间 `O(n log n)`（排序主导），空间 `O(n)`。',
    en:
      'Convex Hull Area: given a planar point set, compute the convex hull then its area. ' +
      '\nSteps: ' +
      '\n1. Sort points lexicographically by (x,y). ' +
      "\n2. Andrew's monotone chain: build lower and upper hulls, merge (dedup) for CCW vertices. " +
      '\n3. Shoelace formula: A = ½ · |Σ(x_i · y_{i+1} − x_{i+1} · y_i)|. ' +
      '\nTime O(n log n) (sort dominates), space O(n).',
  },
  tags: ['geometry', 'convex-hull', 'area', 'shoelace'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
