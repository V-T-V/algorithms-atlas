// 线段长度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-segment-length',
  categoryId: 'geometry',
  title: { zh: '线段长度', en: 'Segment Length' },
  summary: { zh: '求线段欧氏长度。', en: 'Euclidean length of a segment.' },
  description: {
    zh: '长度 = √((b.x-a.x)² + (b.y-a.y)²)。',
    en: 'Length = √((b.x-a.x)² + (b.y-a.y)²).',
  },
  tags: ['geometry', 'segment'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
