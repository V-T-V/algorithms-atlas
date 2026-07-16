// 点到线段距离 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-point-segment-dist',
  categoryId: 'geometry',
  title: { zh: '点到线段距离', en: 'Point to Segment Distance' },
  summary: { zh: '求点到线段最短距离。', en: 'Shortest distance from a point to a segment.' },
  description: {
    zh: '将点投影到线段所在直线，参数 t 限制在 [0,1] 内取最近点距离。',
    en: 'Project onto the line, clamp parameter t to [0,1], then distance.',
  },
  tags: ['geometry', 'distance'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
