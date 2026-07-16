// 区间图着色（Interval Graph Coloring）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-interval-graph-color',
  categoryId: 'greedy',
  title: { zh: '区间图着色', en: 'Interval Graph Coloring' },
  summary: {
    zh: '给重叠区间分配最少颜色，等价于会议室安排，扫描线贪心。',
    en: 'Assign minimum colors to overlapping intervals; sweep-line greedy equals meeting-room allocation.',
  },
  description: {
    zh: '区间图着色：区间集，相邻（重叠）不同色。最小色数 = 最大重叠数。扫描端点计数。',
    en: 'Interval coloring: overlapping intervals get different colors. Min colors = max overlap. Sweep endpoints.',
  },
  tags: ['greedy', 'interval', 'graph-coloring'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
