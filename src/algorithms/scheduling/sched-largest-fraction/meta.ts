// 最大份额优先 (Largest Fraction) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-largest-fraction',
  categoryId: 'scheduling',
  title: { zh: '最大份额优先 (Largest Fraction)', en: 'Largest Fraction First' },
  summary: {
    zh: '按应得份额与已得份额之差最大者优先调度，逼近目标配额。',
    en: 'Schedule the process whose (entitled − received) gap is largest, converging to target quotas.',
  },
  description: {
    zh: '最大份额优先（Largest Fraction First）是一种配额驱动的公平调度：每个进程有权重 weight，应得 CPU = total × weight/Σweight。每轮选「应得 − 已得」差值最大的进程运行一个时间片，使各进程获得的 CPU 趋近其份额。本质与 stride 调度等价但以「欠额」而非 pass 值度量。',
    en: 'Largest Fraction First is a quota-driven fair scheduler: each process has a weight and an entitled share = total × weight/Σweight. Each round runs the process with the largest (entitled − received) gap for one slice, so received CPU converges to each share. Equivalent in spirit to stride scheduling but measured by deficit rather than pass value.',
  },
  tags: ['scheduling', 'fair', 'fraction', 'deficit'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
