// First-Come First-Served · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fcfs',
  categoryId: 'scheduling',
  title: { zh: '先来先服务', en: 'First-Come First-Served' },
  summary: {
    zh: '最简单的非抢占式调度：按到达顺序依次执行，先到先得。',
    en: 'Simplest non-preemptive policy: run jobs in arrival order, first come first served.',
  },
  description: {
    zh: '先来先服务（FCFS）是最基本的 CPU 调度算法。它按进程到达就绪队列的顺序依次执行，一旦某进程获得 CPU 就一直运行到完成（非抢占）。\n\n优点是实现简单、公平（按到达序）；缺点是平均等待时间往往较长，且存在「护航效应」——一个长作业会让后续所有短作业长时间等待。FCFS 对 I/O 密集型进程也不友好。',
    en: 'First-Come First-Served (FCFS) is the most basic CPU scheduling algorithm. It executes processes in the order they arrive in the ready queue; once a process gets the CPU it runs to completion (non-preemptive).\n\nIt is simple and fair (by arrival order), but tends to have long average waiting time and suffers from the "convoy effect" where a long job delays all subsequent short jobs. It is also unfriendly to I/O-bound processes.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
