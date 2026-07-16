// 周期任务 EDF · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-realtime-edf-2',
  categoryId: 'scheduling',
  title: { zh: '周期任务最早截止期优先', en: 'Periodic Earliest Deadline First' },
  summary: {
    zh: '实时周期任务的 EDF：每周期作业的截止期 = 释放 + D，按最近绝对截止期抢占式调度。',
    en: 'EDF for periodic real-time tasks: each jobs deadline = release + D; preemptively schedule by nearest absolute deadline.',
  },
  description: {
    zh: '本算法是针对「周期任务」的 EDF 变体。每个任务 τi 有周期 T、执行时间 C、相对截止期 D。任务每 T 释放一个新作业，作业的绝对截止期 = 释放时刻 + D。调度器在每个时刻选绝对截止期最近的就绪作业运行（抢占式）。当总利用率 U = Σ(Ci/Ti) ≤ 1 时，EDF 是最优的（任意可调度任务集都能满足）。本实现仿真若干周期并统计是否错过截止期。',
    en: 'This is the EDF variant for periodic tasks. Each task τi has period T, execution C, relative deadline D. A new job is released every T with absolute deadline = release + D. The scheduler runs the ready job with the nearest absolute deadline (preemptively). When total utilization U = Σ(Ci/Ti) ≤ 1, EDF is optimal (any feasible task set is schedulable). This implementation simulates several periods and reports deadline misses.',
  },
  tags: ['scheduling', 'real-time', 'edf', 'periodic', 'preemptive'],
  complexity: { time: 'O(n·H)', space: 'O(n)' },
};
