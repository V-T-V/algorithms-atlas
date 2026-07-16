// 三维欧氏距离 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-distance-3d',
  categoryId: 'geometry',
  title: { zh: '三维欧氏距离', en: '3D Euclidean Distance' },
  summary: { zh: '求三维空间两点距离。', en: 'Euclidean distance between two 3D points.' },
  description: { zh: '距离 = √(Δx² + Δy² + Δz²)。', en: 'Distance = √(Δx² + Δy² + Δz²).' },
  tags: ['geometry', '3d', 'distance'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
