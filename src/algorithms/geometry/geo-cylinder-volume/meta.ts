// 圆柱体积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-cylinder-volume',
  categoryId: 'geometry',
  title: { zh: '圆柱体积', en: 'Cylinder Volume' },
  summary: {
    zh: '由底面半径与高求圆柱体积。',
    en: 'Volume of a cylinder given base radius and height.',
  },
  description: { zh: '体积 = π r² h。', en: 'Volume = π r² h.' },
  tags: ['geometry', '3d', 'volume'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
