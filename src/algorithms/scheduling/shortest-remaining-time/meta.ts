// 最短处理时间优先（非抢占 SPT）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shortest-remaining-time',
  categoryId: 'scheduling',
  title: { zh: '最短处理时间（非抢占 SPT）', en: 'Shortest Processing Time (Non-preemptive SPT)' },
  summary: {
    zh: '非抢占式：CPU 空闲时选就绪队列中处理时间最短的作业运行。',
    en: 'Non-preemptive: when idle, pick the ready job with the shortest processing time.',
  },
  description: {
    zh: '最短处理时间优先（Shortest Processing Time first, SPT）的非抢占式版本，又称 Shortest Job First (SJF) 非抢占。规则：\n- 当 CPU 空闲时，从「当前已到达但未完成」的作业中，选处理时间（burst）最短的运行\n- 一旦开始运行便执行到完成（非抢占）\n- 平局按到达时间，再按 id\n\nSPT 非抢占式可最小化平均等待时间（在所有作业同时到达时严格最优）。本实现与已有的 srtf（抢占版）不同：srtf 在新作业到达时可能抢占当前作业，而本算法不会。',
    en: 'Non-preemptive Shortest Processing Time first (a.k.a. non-preemptive SJF): when the CPU is idle, pick the ready job (already arrived) with the shortest burst and run it to completion. Minimizes average waiting time when all jobs arrive together. Unlike the existing srtf (preemptive), this variant never preempts a running job.',
  },
  tags: ['scheduling', 'spt', 'sjf', 'non-preemptive', 'greedy'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
