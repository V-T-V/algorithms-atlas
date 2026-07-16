// 时间驱动调度 (Time-Driven) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-time-driven',
  categoryId: 'scheduling',
  title: { zh: '时间驱动调度 (Time-Driven)', en: 'Time-Driven Scheduling' },
  summary: {
    zh: '把周期固定为等长时间槽，每槽分配一个任务，剩余 slack 留给偶发任务。',
    en: 'Divide the period into equal time slots, assign one task per slot, and leave slack for sporadic jobs.',
  },
  description: {
    zh: '时间驱动调度是循环执行的简化形式：整个调度周期被均分为若干等长时间槽（slot），每个槽分配一个任务按序执行。任意槽若任务提前完成，剩余时间（slack）可用于偶发任务或空闲。本实现根据任务执行时间填入槽中，统计每周期总负载与 slack，并报告可调度性。',
    en: 'Time-Driven Scheduling is a simplified cyclic executive: the whole period is split into equal time slots, each assigned one task executed in order. If a task finishes early the remaining slack can serve sporadic jobs or idle. This implementation packs tasks into slots, reports per-period load and slack, and checks feasibility.',
  },
  tags: ['scheduling', 'real-time', 'time-driven', 'slot', 'static'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
