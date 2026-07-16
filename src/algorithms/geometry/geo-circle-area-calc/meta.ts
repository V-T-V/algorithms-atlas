// 圆面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-circle-area-calc',
  categoryId: 'geometry',
  title: { zh: '圆面积', en: 'Circle Area' },
  summary: { zh: '由半径计算圆面积。', en: 'Area of a circle given its radius.' },
  description: { zh: '面积 = π r²。', en: 'Area = π r².' },
  tags: ['geometry', 'circle', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
