// 圆周长 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-circle-circumference',
  categoryId: 'geometry',
  title: { zh: '圆周长', en: 'Circle Circumference' },
  summary: { zh: '由半径计算圆周长。', en: 'Circumference of a circle given its radius.' },
  description: { zh: '周长 = 2πr。', en: 'Circumference = 2πr.' },
  tags: ['geometry', 'circle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
