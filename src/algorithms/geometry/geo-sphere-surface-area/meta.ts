// 球表面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-sphere-surface-area',
  categoryId: 'geometry',
  title: { zh: '球表面积', en: 'Sphere Surface Area' },
  summary: { zh: '由半径求球体表面积。', en: 'Surface area of a sphere given radius.' },
  description: { zh: '表面积 = 4πr²。', en: 'Surface area = 4πr².' },
  tags: ['geometry', '3d', 'sphere'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
