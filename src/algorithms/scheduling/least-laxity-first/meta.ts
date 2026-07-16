// 最小松弛度优先（Least Laxity First, LLF）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'least-laxity-first',
  categoryId: 'scheduling',
  title: { zh: '最小松弛度优先（LLF）', en: 'Least Laxity First (LLF)' },
  summary: {
    zh: '动态优先级：每步重算 laxity = D − 剩余执行 − 时间，选最小者。',
    en: 'Dynamic priority: each tick recompute laxity = D − remaining − time and run the smallest.',
  },
  description: {
    zh: '最小松弛度优先（Least Laxity First / Least Slack Time First, LLF/LST）是动态优先级实时调度。松弛度（laxity）定义为：\n  laxity = 绝对截止期 − 当前时间 − 剩余执行时间\n\n每个时间单位，调度器选 laxity 最小的就绪任务执行（抢占式）。laxity 越小表示越紧迫。laxity 为 0 表示必须立即执行否则错过。\n\n- LLF 是单处理器最优动态调度之一\n- 但 laxity 相等的任务可能频繁切换（thrashing）\n- 复杂度 O(H·n)，H 为仿真时长',
    en: 'Least Laxity First (LLF / Least Slack Time First) is a dynamic-priority real-time scheduler. Laxity = absolute deadline − current time − remaining execution. Each tick, run the ready task with the smallest laxity (preemptive). LLF is optimal among dynamic schedulers on a single processor but may thrash when laxities tie.',
  },
  tags: ['scheduling', 'real-time', 'least-laxity', 'dynamic-priority', 'preemptive'],
  complexity: { time: 'O(H · n)', space: 'O(n)' },
};
