// 贪心线段覆盖（Greedy Segment Cover）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-line-arrangement',
  categoryId: 'greedy',
  title: { zh: '贪心线段覆盖', en: 'Greedy Segment Cover' },
  summary: {
    zh: '用最少定长线段覆盖所有点，按右端点贪心放置。',
    en: 'Cover all points with the fewest fixed-length segments; place greedily by right endpoint.',
  },
  description: {
    zh: '线段覆盖：数轴上点集，定长 L 线段。按点排序，每次把线段右端放当前最左点+L，跳过已覆盖。',
    en: 'Segment cover: points on a line, segment length L. Sort points, place right end at leftmost+L, skip covered.',
  },
  tags: ['greedy', 'interval', 'geometry'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
