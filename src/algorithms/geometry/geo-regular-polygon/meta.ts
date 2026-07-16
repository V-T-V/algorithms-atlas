// 正多边形顶点 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-regular-polygon',
  categoryId: 'geometry',
  title: { zh: '正多边形顶点', en: 'Regular Polygon Vertices' },
  summary: { zh: '生成正 n 边形顶点坐标。', en: 'Generate vertices of a regular n-gon.' },
  description: {
    zh: '以圆心 (cx,cy)、半径 r，第 k 个顶点角度 = 2πk/n + startAngle。',
    en: 'Vertex k at angle 2πk/n + startAngle around center with radius r.',
  },
  tags: ['geometry', 'polygon'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
