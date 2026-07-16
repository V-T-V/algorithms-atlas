// Shortest Remaining Time First · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'srtf',
  categoryId: 'scheduling',
  title: { zh: '最短剩余时间优先', en: 'Shortest Remaining Time First' },
  summary: {
    zh: 'SJF 的抢占式版本：每当新进程到达且剩余更短时立即抢占当前运行进程。',
    en: 'Preemptive variant of SJF: preempt the running process when a newly arrived job has shorter remaining time.',
  },
  description: {
    zh: '最短剩余时间优先（SRTF）是最短作业优先（SJF）的抢占式版本。每个时间点调度器从已到达且未完成的进程中，选择「剩余执行时间最短」的运行；当新进程到达且其完整 burst 比当前进程的剩余时间还短时，立即抢占。\n\nSRTF 的平均等待时间在所有调度策略中是最优的（理论上下界），但代价是频繁的上下文切换开销，且同样存在饥饿问题（长作业可能一直被短作业抢占）。判定点在「段结束」和「新进程到达」时。',
    en: "Shortest Remaining Time First (SRTF) is the preemptive version of Shortest Job First. At each instant the scheduler picks, among arrived and unfinished jobs, the one with the shortest remaining burst; it preempts the running process whenever a newly arrived job has a full burst shorter than the running job's remaining time.\n\nSRTF achieves the optimal (minimum) average waiting time among scheduling policies, at the cost of frequent context switches and the same starvation risk as SJF (long jobs may be perpetually preempted). Decision points are segment ends and new arrivals.",
  },
  tags: ['scheduling', 'preemptive', 'cpu-scheduling'],
  complexity: { time: 'O(n·T)', space: 'O(n)' },
};
