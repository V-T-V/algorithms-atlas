// 四面体体积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-tetrahedron-volume',
  categoryId: 'geometry',
  title: { zh: '四面体体积', en: 'Tetrahedron Volume' },
  summary: {
    zh: '由四面体四顶点求体积（标量三重积）。',
    en: 'Volume of a tetrahedron from four vertices (scalar triple product).',
  },
  description: {
    zh: '以一个面为底，体积 = |det(b-a, c-a, d-a)| / 6。',
    en: 'Volume = |det(b-a, c-a, d-a)| / 6.',
  },
  tags: ['geometry', '3d', 'volume'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
