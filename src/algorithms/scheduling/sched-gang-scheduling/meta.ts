// 成组调度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-gang-scheduling',
  categoryId: 'scheduling',
  title: { zh: '成组调度 (Gang Scheduling)', en: 'Gang Scheduling' },
  summary: {
    zh: '相关线程作为一个整体同时调度到多核，避免忙等。',
    en: 'Schedule related threads as a group across cores simultaneously to avoid busy-waiting.',
  },
  description: {
    zh: '成组调度：把频繁同步的线程组在同一时间片内同时派发到所有核心，使它们并行推进。避免「一个在等、一个没跑」的忙等浪费。',
    en: 'Gang scheduling: dispatch a tightly synchronized thread group to all cores in the same time slice so they progress in parallel, avoiding "one waits, another doesn\'t run" busy-waiting.',
  },
  tags: ['scheduling', 'gang', 'multicore', 'parallel'],
  complexity: { time: 'O(g*p)', space: 'O(p)' },
};
