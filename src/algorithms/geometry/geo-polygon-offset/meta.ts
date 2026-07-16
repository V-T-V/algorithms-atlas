// 多边形偏移 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-polygon-offset',
  categoryId: 'geometry',
  title: { zh: '多边形偏移', en: 'Polygon Offset' },
  summary: {
    zh: '沿各边法向把多边形每条边平移距离 d，求新顶点。',
    en: 'Offset each edge of a polygon along its normal by distance d and recompute vertices.',
  },
  description: {
    zh: '多边形偏移（offset / buffering）：对每条边沿其单位法向平移距离 d，再求相邻偏移边的交点作为新顶点。\n\n步骤：\n1. 对顶点 i，取入边 (i-1→i) 与出边 (i→i+1)\n2. 计算两边的单位法向（取边方向逆时针旋转 90°，即数学 CCW 多边形的内侧法向 (-dy, dx)）\n3. 把两边各自沿法向平移 d，求两直线交点为新顶点\n\n正值 d 向内收缩、负值向外扩张（对 CCW 多边形）。是 CAD/CAM、路径规划的常用操作。复杂度 O(n)。',
    en: 'Polygon offset (buffering): translate each edge by distance d along its left normal (-dy,dx) — the inward normal for a mathematically CCW polygon — then intersect adjacent offset edges to get new vertices. d>0 shrinks inward, d<0 expands outward. Used in CAD/CAM and path planning. O(n).',
  },
  tags: ['geometry', 'polygon', 'offset', 'buffer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
