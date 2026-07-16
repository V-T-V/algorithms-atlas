// 点在多边形内（射线法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-polygon-contains',
  categoryId: 'geometry',
  title: { zh: '点在多边形内（射线法）', en: 'Point in Polygon (Ray Casting)' },
  summary: {
    zh: '从待测点向右水平射线，与多边形边的交点数为奇数即在内部。',
    en: 'Cast a rightward ray from the point; odd number of edge crossings means inside.',
  },
  description: {
    zh:
      '点在多边形内（Point in Polygon, 射线法 / Ray Casting / Even-Odd 规则）：' +
      '判定点 P 是否在多边形内部。' +
      '\n- 从 P 向 +x 方向发射水平射线，统计与多边形边的交点数。' +
      '\n- 奇数次 → 内部；偶数次（含 0）→ 外部。' +
      '\n- 关键技巧：只统计「上端点包含、下端点不包含」的边，避免顶点处重复计数：' +
      '  当 `(yi > y) ≠ (yj > y)` 时，计算交点 x，若 `x > Px` 则计数 +1。' +
      '\n- 适用于任意简单多边形（凸/凹、不自交），不依赖多边形方向。' +
      '\n- 时间 `O(n)`，空间 `O(1)`。',
    en:
      'Point in Polygon (Ray Casting / Even-Odd rule): determine whether point P lies inside a polygon. ' +
      '\n- Cast a horizontal ray from P in +x direction, count crossings with polygon edges. ' +
      '\n- Odd → inside; even (incl. 0) → outside. ' +
      '\n- Key trick: count an edge only when its endpoints straddle y with half-open range ' +
      '  `(yi > y) ≠ (yj > y)`, then test if the intersection x > Px. ' +
      '\n- Works for any simple polygon (convex/concave, either winding). ' +
      '\nTime O(n), space O(1).',
  },
  tags: ['geometry', 'polygon', 'point-in-polygon', 'ray-casting'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
