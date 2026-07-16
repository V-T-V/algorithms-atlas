// 最高响应比优先（抢占式）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-highest-response-2',
  categoryId: 'scheduling',
  title: { zh: '抢占式最高响应比优先', en: 'Preemptive Highest Response Ratio Next' },
  summary: {
    zh: 'HRRN 的抢占式变体：每次有新进程到达时重算响应比，可抢占当前运行进程。',
    en: 'Preemptive variant of HRRN: recompute response ratios on every arrival and preempt the running process.',
  },
  description: {
    zh: '经典 HRRN 是非抢占式的：进程一旦开始就运行到完成。本变体引入抢占——每当有新进程到达时，对所有就绪进程重算响应比 R = (等待 + 剩余) / 剩余，若某就绪进程 R 高于当前运行进程的 R，则切换。这样进一步降低平均等待时间，但切换开销更大。响应比随等待增加而上升，保证不会饥饿。',
    en: 'Classic HRRN is non-preemptive: once a process starts it runs to completion. This variant introduces preemption: at every arrival, response ratios R = (wait + remaining) / remaining are recomputed for all ready processes, and the running process is preempted if another has a higher R. This further lowers average waiting time at the cost of more context switches. Ratios grow with waiting time, so starvation is avoided.',
  },
  tags: ['scheduling', 'hrrn', 'preemptive', 'response-ratio'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
