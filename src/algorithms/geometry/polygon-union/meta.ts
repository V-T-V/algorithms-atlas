// 多边形并集面积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polygon-union',
  categoryId: 'geometry',
  title: { zh: '多边形并集面积', en: 'Polygon Union Area' },
  summary: {
    zh: '用容斥原理与蒙特卡洛采样估计多个多边形并集面积：面积 = 总框面积 × 命中比例。',
    en: 'Estimate the area of a union of polygons via Monte Carlo sampling over the bounding box: area = boxArea × hit ratio.',
  },
  description: {
    zh: '多个多边形的并集面积是计算几何的经典问题。精确方法（如 Greiner-Hormann 布尔运算或梯形分解）实现复杂、对退化情况敏感。本实现演示一种稳健的**蒙特卡洛估计**：先求所有多边形的联合包围盒 [xmin,xmax]×[ymin,ymax]，在框内均匀随机投 N 个点，统计「落在至少一个多边形内」的点数 H，则并集面积 ≈ 框面积 × H / N，误差 O(1/√N)。每个点的归属判定用射线法（point-in-polygon）。这是处理任意复杂多边形（含孔、自交近似）的实用兜底方案。同时提供精确的「不相交」与「完全包含」快速路径：当所有多边形两两不相交时，并集面积 = 各面积之和。',
    en: 'The area of the union of several polygons is a classic computational geometry problem. Exact methods (e.g. Greiner-Hormann boolean operations or trapezoidal decomposition) are complex to implement and sensitive to degeneracies. This implementation demonstrates a robust **Monte Carlo estimate**: first compute the joint bounding box [xmin,xmax]×[ymin,ymax] of all polygons; sample N uniform points in the box; count how many H land inside at least one polygon (ray-casting point-in-polygon); the union area ≈ boxArea × H / N with O(1/√N) error. This is a practical fallback for arbitrary complex polygons (with holes, near self-intersection). Fast exact paths are provided for disjoint (union = sum of areas) and containment cases.',
  },
  tags: ['geometry', 'polygon', 'union', 'monte-carlo', 'area'],
  complexity: { time: 'O(N·m·k)', space: 'O(1)' },
};
