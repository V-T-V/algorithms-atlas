// 重心坐标 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-barycentric-coord',
  categoryId: 'geometry',
  title: { zh: '重心坐标', en: 'Barycentric Coordinates' },
  summary: {
    zh: '求点 P 在三角形 ABC 中的重心坐标。',
    en: 'Barycentric coordinates of P in triangle ABC.',
  },
  description: {
    zh: 'P = uA + vB + wC，u+v+w=1。用面积比求解。',
    en: 'P = uA + vB + wC with u+v+w=1; computed via area ratios.',
  },
  tags: ['geometry', 'triangle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
