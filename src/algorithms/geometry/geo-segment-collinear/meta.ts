// 线段共线判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-segment-collinear',
  categoryId: 'geometry',
  title: { zh: '线段共线判定', en: 'Segment Collinearity Test' },
  summary: {
    zh: '判断两条线段是否共线（四点叉积全为 0），并检测重叠区间。',
    en: 'Test whether two segments are collinear (all cross-products zero) and find overlap.',
  },
  description: {
    zh: '线段共线判定：线段 AB 与 CD 共线，当且仅当四个端点相对同一直线的叉积都为 0：\n```\ncross(A,B,C) = 0 且 cross(A,B,D) = 0\n```\n（C、D 都在直线 AB 上）。\n\n进一步可用投影区间判定它们是否**重叠**。\n\n共线是计算几何中的边界情况，影响线段相交、多边形布尔运算。复杂度 O(1)。',
    en: 'Segment collinearity: AB and CD are collinear iff cross(A,B,C)=0 and cross(A,B,D)=0 (both C,D lie on line AB). Overlap can then be tested via projection intervals. A boundary case affecting segment intersection and polygon booleans. O(1).',
  },
  tags: ['geometry', 'collinear', 'cross-product', 'segment'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
