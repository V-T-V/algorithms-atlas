// 圆锥体积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-cone-volume',
  categoryId: 'geometry',
  title: { zh: '圆锥体积', en: 'Cone Volume' },
  summary: {
    zh: '由底面半径与高求圆锥体积。',
    en: 'Volume of a cone given base radius and height.',
  },
  description: { zh: '体积 = ⅓ π r² h。', en: 'Volume = ⅓ π r² h.' },
  tags: ['geometry', '3d', 'volume'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
