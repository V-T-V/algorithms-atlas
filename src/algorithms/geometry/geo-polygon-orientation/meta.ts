// 多边形方向 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-orientation',
  categoryId: 'geometry',
  title: { zh: '多边形方向', en: 'Polygon Orientation' },
  summary: {
    zh: '判断多边形顶点顺序为顺时针或逆时针。',
    en: 'Determine polygon vertex order (CW or CCW).',
  },
  description: {
    zh: '用鞋带公式得带符号面积：>0 为逆时针，<0 为顺时针，0 共线。',
    en: 'Shoelace signed area: positive = CCW, negative = CW, zero = degenerate.',
  },
  tags: ['geometry', 'polygon'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
