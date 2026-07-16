// 多边形平移 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-translate',
  categoryId: 'geometry',
  title: { zh: '多边形平移', en: 'Polygon Translation' },
  summary: { zh: '把多边形整体平移 (dx,dy)。', en: 'Translate a polygon by (dx, dy).' },
  description: { zh: '每个顶点 P_i ← P_i + (dx, dy)。', en: 'Each vertex P_i ← P_i + (dx, dy).' },
  tags: ['geometry', 'polygon', 'transformation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
