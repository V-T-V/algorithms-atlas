// 多边形三角剖分（耳切法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polygon-triangulation',
  categoryId: 'geometry',
  title: { zh: '多边形三角剖分（耳切法）', en: 'Polygon Triangulation (Ear Clipping)' },
  summary: {
    zh: '简单多边形可剖分为 n−2 个三角形；耳切法反复剪去「耳尖」（凸且无内点的顶点）。',
    en: 'A simple polygon triangulates into n−2 triangles; ear clipping repeatedly removes an "ear" — a convex vertex with no other vertex inside.',
  },
  description: {
    zh: '多边形三角剖分：把一个简单多边形分解为若干互不重叠的三角形，三角形个数为 n−2（n 为顶点数）。经典「双耳定理」（Meisters, 1975）保证任何顶点数 ≥4 的简单多边形至少有两个「耳」（ear）——即一个由连续三个顶点构成的三角形，它完全在多边形内部且不含其它顶点。耳切法（Ear Clipping）据此反复剪耳：遍历剩余顶点，找到一个「凸」（叉积方向正确）且其对角线不与其它边相交、三角形内不含其它剩余顶点的顶点，把它作为耳剪下，得到一个三角形输出，剩余多边形顶点数减一，直到只剩一个三角形。朴素实现 O(n²)，配合优化可达 O(n log n)。本实现要求输入为逆时针顺序的简单多边形。',
    en: 'Polygon triangulation: decompose a simple polygon into non-overlapping triangles — exactly n−2 of them for n vertices. The classic "two ears theorem" (Meisters, 1975) guarantees every simple polygon with ≥4 vertices has at least two "ears" — a triangle formed by three consecutive vertices that lies entirely inside the polygon and contains no other vertex. Ear clipping exploits this: scan the remaining vertices to find a "convex" one (correct cross-product sign) whose diagonal crosses no other edge and whose triangle contains no remaining vertex; cut it off, emit the triangle, decrement the vertex count, repeat until one triangle remains. The naive implementation is O(n²); optimizations reach O(n log n). This implementation assumes an input polygon in counter-clockwise order.',
  },
  tags: ['geometry', 'polygon', 'triangulation', 'ear-clipping'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
