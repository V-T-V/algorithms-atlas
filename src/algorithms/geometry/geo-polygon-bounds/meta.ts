// 多边形包围盒 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-bounds',
  categoryId: 'geometry',
  title: { zh: '多边形包围盒', en: 'Polygon Bounding Box' },
  summary: {
    zh: '求多边形轴对齐包围盒（AABB）。',
    en: 'Axis-aligned bounding box (AABB) of a polygon.',
  },
  description: {
    zh: '遍历顶点取 min/max 得到 [minX,minY,maxX,maxY] 与宽高。',
    en: 'Scan vertices for min/max to get AABB and dimensions.',
  },
  tags: ['geometry', 'polygon', 'bounding-box'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
