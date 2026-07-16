// 多核均衡调度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-multicore-balanced',
  categoryId: 'scheduling',
  title: { zh: '多核均衡调度（LPT）', en: 'Multicore Balanced Scheduling (LPT)' },
  summary: {
    zh: 'LPT 贪心：任务按耗时降序，每次分给当前负载最小的核。',
    en: 'LPT greedy: sort tasks descending by duration, assign each to the least-loaded core.',
  },
  description: {
    zh: '多核均衡（Longest Processing Time first）：把任务按执行时长降序排列，依次分配给当前累计负载最小的处理器。是 P||Cmax 的 4/3-近似算法。',
    en: 'Multicore balancing (Longest Processing Time first): sort tasks by duration descending and assign each to the currently least-loaded processor. A 4/3-approximation for P||Cmax.',
  },
  tags: ['scheduling', 'multicore', 'lpt', 'load-balancing'],
  complexity: { time: 'O(n log n + n log p)', space: 'O(n+p)' },
};
