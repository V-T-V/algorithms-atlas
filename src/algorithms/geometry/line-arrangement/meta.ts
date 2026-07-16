// 直线排列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'line-arrangement',
  categoryId: 'geometry',
  title: { zh: '直线排列', en: 'Line Arrangement' },
  summary: {
    zh: 'n 条直线把平面划分为若干区域；求所有两两交点与排列的面/边/顶点数。',
    en: 'n lines partition the plane into regions; compute all pairwise intersection points and the arrangement counts.',
  },
  description: {
    zh: '直线排列（Line Arrangement）是计算几何的基本结构：给定平面上 n 条直线，它们把平面划分成若干顶点、边和面。关键性质：(1) 顶点 = 两两直线的交点（一般位置下共 C(n,2) 个，无三线共点）；(2) 每条直线被其余 n−1 条直线分成 n 段（边），故边数 = n²（含射线）；(3) 由欧拉公式（平面图 V−E+F=2，含无穷面）可推出面数 F = n(n+1)/2 + 1。本实现计算所有两两交点（朴素 O(n²)），并按上述公式给出排列的顶点数、边数、面数（一般位置假设）。增量构造法可在 O(n² log n) 内建成完整带拓扑的排列，本演示侧重数值与计数。',
    en: "The line arrangement is a fundamental structure in computational geometry: given n lines in the plane, they partition it into vertices, edges, and faces. Key properties: (1) vertices = pairwise intersections (C(n,2) in general position, no three concurrent); (2) each line is split by the other n−1 lines into n segments (edges), so edges = n² (including rays); (3) by Euler's formula for planar graphs (V−E+F=2, including the unbounded face) the number of faces F = n(n+1)/2 + 1. This implementation computes all pairwise intersections (naive O(n²)) and reports the vertex/edge/face counts under the general-position assumption. A full incremental construction with topology can be built in O(n² log n); this demo focuses on numerics and counts.",
  },
  tags: ['geometry', 'line-arrangement', 'intersection', 'combinatorics'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
