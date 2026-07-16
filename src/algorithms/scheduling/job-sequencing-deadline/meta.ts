// 带截止期限的作业排序（贪心）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'job-sequencing-deadline',
  categoryId: 'scheduling',
  title: { zh: '带截止期限的作业排序（贪心）', en: 'Job Sequencing with Deadlines (Greedy)' },
  summary: {
    zh: '每作业有利润与截止期，单位时间作业，贪心选最大利润可行调度。',
    en: 'Each job has profit and deadline, unit-time each; greedily pick max-profit feasible schedule.',
  },
  description: {
    zh: '经典贪心问题：n 个作业，每个作业 j 需 1 单位时间，有截止期 dj（正整数）和利润 pj，每个时间槽最多放一个作业，目标最大化所选作业的总利润。\n\n贪心算法：\n1. 按利润降序排序\n2. 对每个作业，尽量安排在 ≤ dj 的最晚空闲槽（用并查集或线性查找）\n3. 若找到空闲槽则选入，否则跳过\n\n时间 O(n log n + n·dmax)（线性查找）或 O(n log n + n·α)（并查集优化）。',
    en: 'Classic greedy: n unit-time jobs each with deadline dj and profit pj; maximize total profit of jobs scheduled within their deadlines. Sort by profit desc; for each job place it in the latest free slot ≤ dj (linear scan or union-find).',
  },
  tags: ['scheduling', 'greedy', 'deadline', 'max-profit'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
