// 三角形带符号面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-triangle-area-signed',
  categoryId: 'geometry',
  title: { zh: '三角形带符号面积', en: 'Signed Triangle Area' },
  summary: { zh: '用叉积求三角形带符号面积。', en: 'Signed area of a triangle via cross product.' },
  description: {
    zh: '面积 = ((b-a)×(c-a))/2，符号表示顶点方向（逆时针为正）。',
    en: 'Area = ((b-a)×(c-a))/2; sign = vertex orientation (CCW positive).',
  },
  tags: ['geometry', 'triangle', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
