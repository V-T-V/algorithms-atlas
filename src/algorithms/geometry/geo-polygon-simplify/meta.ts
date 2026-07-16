// 多边形简化（Douglas-Peucker）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-polygon-simplify',
  categoryId: 'geometry',
  title: { zh: '多边形简化（Douglas-Peucker）', en: 'Polygon Simplification (Douglas-Peucker)' },
  summary: {
    zh: 'Douglas-Peucker 算法：递归丢弃偏离基线小于 ε 的点。',
    en: 'Douglas-Peucker algorithm: recursively drops points within ε of the baseline.',
  },
  description: {
    zh: 'Douglas-Peucker（迭代端点拟合）简化折线/多边形：\n\n1. 连接首末两点为基线\n2. 找到离基线最远的中间点；若距离 > ε，保留该点并对其两侧递归\n3. 否则丢弃所有中间点\n\n用点到线段的**垂直距离**（投影夹紧到 [0,1]）。\n\nε 越大简化越激进。常用于地图轨迹压缩、几何细节去除。复杂度平均 O(n log n)，最坏 O(n²)。',
    en: 'Douglas-Peucker simplifies a polyline/polygon: connect endpoints as a baseline, find the farthest intermediate point; if its distance > ε, keep it and recurse on both sides, else drop all middle points. Uses point-to-segment perpendicular distance (projection clamped). Larger ε → more aggressive simplification. Used in map trajectory compression. Avg O(n log n), worst O(n²).',
  },
  tags: ['geometry', 'simplification', 'douglas-peucker', 'recursive'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
