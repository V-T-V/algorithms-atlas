// Fortune Voronoi · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-voronoi-fortune',
  categoryId: 'geometry',
  title: { zh: 'Fortune Voronoi 图', en: 'Fortune Voronoi Diagram' },
  summary: {
    zh: '计算点集的 Voronoi 图：每个生成点对应一个单元，单元内点到该点最近。',
    en: 'Compute the Voronoi diagram of points: each site owns a cell of points closer to it than any other.',
  },
  description: {
    zh: 'Voronoi 图把平面划分为若干单元，每个生成点（site）对应一个单元，单元内任意点到该 site 比到其他 site 都近。\n\n本实现采用与 Fortune 扫描线**等价**的空圆法（Delaunay 对偶）：\n\n1. 对每三个点 i、j、k 计算外心 C（即过三点的圆心）\n2. 若该圆为「空圆」（无其他 site 落在圆内），则 C 是一个 Voronoi 顶点，对应 Delaunay 三角形\n3. 相邻 Delaunay 三角形的外心相连即 Voronoi 边\n\nVoronoi 顶点 = Delaunay 三角形外心，Voronoi 边 = 两相邻外心的连线。教学版 O(n⁴)，Fortune 原版扫描线 O(n log n)。',
    en: "The Voronoi diagram partitions the plane into cells, one per site, where every point in a cell is closer to that site than any other. This implementation uses the empty-circle (Delaunay-dual) method, equivalent to Fortune's sweep-line: compute the circumcenter of every triple; keep it as a Voronoi vertex iff its circumcircle is empty (no other site inside). Adjacent circumcenters connect into Voronoi edges. Teaching version O(n⁴); Fortune's sweep-line is O(n log n).",
  },
  tags: ['geometry', 'voronoi', 'fortune', 'delaunay', 'spatial'],
  complexity: { time: 'O(n⁴)', space: 'O(n)' },
};
