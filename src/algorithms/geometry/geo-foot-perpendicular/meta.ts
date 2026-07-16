// 垂足 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-foot-perpendicular',
  categoryId: 'geometry',
  title: { zh: '垂足', en: 'Foot of Perpendicular' },
  summary: { zh: '求点到直线的垂足。', en: 'Foot of perpendicular from a point to a line.' },
  description: {
    zh: '将点投影到直线 ax+by+c=0：垂足 = P - (aP.x+bP.y+c)/(a²+b²) · (a,b)。',
    en: 'Project point onto line ax+by+c=0; foot = P - (aP.x+bP.y+c)/(a²+b²)·(a,b).',
  },
  tags: ['geometry', 'line', 'projection'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
