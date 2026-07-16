// 四边形面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-quadrilateral-area',
  categoryId: 'geometry',
  title: { zh: '四边形面积', en: 'Quadrilateral Area' },
  summary: {
    zh: '用鞋带公式求简单四边形面积。',
    en: 'Area of a simple quadrilateral via the shoelace formula.',
  },
  description: {
    zh: '对四个顶点应用鞋带公式：面积 = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|。',
    en: 'Shoelace over four vertices: area = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|.',
  },
  tags: ['geometry', 'polygon', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
