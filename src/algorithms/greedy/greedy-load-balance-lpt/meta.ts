// LPT 调度（Longest Processing Time Scheduling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-load-balance-lpt',
  categoryId: 'greedy',
  title: { zh: 'LPT 调度', en: 'Longest Processing Time Scheduling' },
  summary: {
    zh: '按作业时长降序，每次把作业分给最闲机器，近似比 4/3-1/(3m)。',
    en: 'Sort jobs descending, assign each to the least-loaded machine; ratio 4/3-1/(3m).',
  },
  description: {
    zh: 'LPT：m 台相同机，n 个作业。按处理时长降序，每次选当前负载最小的机器分配。Graham 定理：makespan ≤ (4/3-1/(3m))·OPT。',
    en: 'LPT: m identical machines, n jobs. Sort by length desc, assign to the least loaded machine. Graham: makespan <= (4/3-1/(3m))·OPT.',
  },
  tags: ['greedy', 'scheduling', 'approximation'],
  complexity: { time: 'O(n log n)', space: 'O(m)' },
};
