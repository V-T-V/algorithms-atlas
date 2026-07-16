// 矩形相交面积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-rectangle-intersect',
  categoryId: 'geometry',
  title: { zh: '矩形相交面积', en: 'Rectangle Intersection Area' },
  summary: {
    zh: '两轴对齐矩形相交区域的面积（不相交返回 0）。',
    en: 'Area of the intersection of two axis-aligned rectangles (0 if disjoint).',
  },
  description: {
    zh: '轴对齐矩形相交面积：两矩形 R1、R2（用左上角 + 宽高表示）的相交矩形为：\n```\nx1 = max(R1.x, R2.x)\ny1 = max(R1.y, R2.y)\nx2 = min(R1.x + R1.w, R2.x + R2.w)\ny2 = min(R1.y + R1.h, R2.y + R2.h)\nw = x2 - x1\nh = y2 - y1\n若 w <= 0 或 h <= 0：面积 = 0\n否则：面积 = w * h\n```\n\n复杂度 O(1)。是碰撞检测、空间索引、图形裁剪的基础。',
    en: 'Axis-aligned rectangle intersection area: compute the overlap rectangle via max/min of corners; area = max(0, w) * max(0, h). O(1). Foundational for collision detection, spatial indexing, and clipping.',
  },
  tags: ['geometry', 'rectangle', 'intersection', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
