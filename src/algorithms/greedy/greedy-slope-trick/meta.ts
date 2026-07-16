// Slope Trick（Slope Trick）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-slope-trick',
  categoryId: 'greedy',
  title: { zh: 'Slope Trick', en: 'Slope Trick' },
  summary: {
    zh: '用分段线性凸函数斜率变化堆维护贪心决策，求解序列型凸优化。',
    en: 'Maintain piecewise-linear convex slope changes via a heap for greedy sequence convex optimization.',
  },
  description: {
    zh: 'Slope Trick：维护凸函数 f 的"转折点"多重集，每次操作 push/pop 堆。常用于绝对值代价的序列 DP（如 Make Array Non-decreasing）。',
    en: 'Slope Trick: maintain the multiset of breakpoints of convex f via a heap. Used for sequence DP with absolute-value costs (e.g. Make Array Non-decreasing).',
  },
  tags: ['greedy', 'convex', 'heap'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
