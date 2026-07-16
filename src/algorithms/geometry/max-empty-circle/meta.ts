// 最大空圆 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'max-empty-circle',
  categoryId: 'geometry',
  title: { zh: '最大空圆', en: 'Max Empty Circle' },
  summary: {
    zh: '在矩形边界内找半径最大的圆，使其内部不含任一给定点；圆心必为某 Voronoi 顶点。',
    en: 'Find the largest-radius circle inside a bounding box whose interior contains none of the given points; its center is a Voronoi vertex.',
  },
  description: {
    zh: '最大空圆问题（Largest Empty Circle）：给定矩形区域 R 内的 n 个点，求 R 内半径最大的圆，使圆内部不含任何给定点（点可在圆周上）。这是计算几何经典问题，其最优解由 Voronoi 图给出：最大空圆的圆心一定是 Voronoi 顶点（即某三个点的外心），或在边界中点。精确算法：用 Delaunay 三角剖分求所有 Voronoi 顶点（三个共圆点的外心），逐个检查其到最近点的距离（半径）是否小于当前最优，并对边界做类似检查，整体 O(n log n)。本实现演示直观的 O(n³)（小规模）枚举法：对所有点三元组算外接圆心（外心），验证它在边界内、圆内无其它更近点，取半径最大者；再枚举点对在边界上的投影作为边界候选。对教学与小数据足够清晰。',
    en: 'The Largest Empty Circle problem: given n points inside a rectangular region R, find the largest-radius circle within R whose interior contains none of the points (points may lie on the boundary). It is a classic computational geometry problem whose optimum is determined by the Voronoi diagram: the center is a Voronoi vertex (the circumcenter of three points) or a boundary midpoint. The exact algorithm computes all Voronoi vertices via Delaunay triangulation, checks each against the nearest point, and also checks boundary candidates, in O(n log n). This implementation demonstrates an intuitive O(n³) (small-scale) enumeration: compute the circumcenter of every triple of points, verify it lies inside the box and is a local maximum of distance to the points, and also consider boundary projections of point pairs. Sufficient for teaching and small data.',
  },
  tags: ['geometry', 'voronoi', 'circle', 'largest-empty-circle'],
  complexity: { time: 'O(n³)', space: 'O(n)' },
};
