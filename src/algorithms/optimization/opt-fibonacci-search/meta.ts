// 斐波那契搜索（Fibonacci Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-fibonacci-search',
  categoryId: 'optimization',
  title: { zh: '斐波那契搜索', en: 'Fibonacci Search' },
  summary: {
    zh: '用斐波那契数比布置探点，比黄金分割更省函数计算。',
    en: 'Place probes by Fibonacci ratios; fewer function evaluations than golden section.',
  },
  description: {
    zh: '斐波那契搜索：用 F_n 划分区间，每轮按 F_{n-1}/F_n 比例取点，n 步收敛最优。',
    en: 'Fibonacci search: divide by F_n, probe at F_{n-1}/F_n; optimal n-step convergence.',
  },
  tags: ['optimization', 'line-search', 'unimodal'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
