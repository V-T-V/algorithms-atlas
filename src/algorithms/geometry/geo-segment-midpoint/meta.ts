// 线段中点 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-segment-midpoint',
  categoryId: 'geometry',
  title: { zh: '线段中点', en: 'Segment Midpoint' },
  summary: { zh: '求线段 ab 中点。', en: 'Midpoint of segment ab.' },
  description: {
    zh: '中点 M = ((a.x+b.x)/2, (a.y+b.y)/2)。',
    en: 'Midpoint M = ((a.x+b.x)/2, (a.y+b.y)/2).',
  },
  tags: ['geometry', 'segment'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
