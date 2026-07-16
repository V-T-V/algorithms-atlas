// 多级反馈队列 (MLFQ) · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-multilevel-feedback-3',
  categoryId: 'scheduling',
  title: { zh: '多级反馈队列 (MLFQ)', en: 'Multilevel Feedback Queue (MLFQ)' },
  summary: {
    zh: '多个优先级队列，进程从高优先级开始，用尽时间片后降级，兼顾响应时间和吞吐量。',
    en: 'Multiple priority queues; processes start high and demote after using up their quantum, balancing responsiveness and throughput.',
  },
  description: {
    zh: '设有 L 个队列 Q0..Q(L-1)，Q0 优先级最高。每个队列有自己的时间片 quantum[i]（随 i 递增）。新进程进入 Q0。调度时从最高非空队列取队首运行 quantum[i]：若未完成且这次用完了 quantum，则降级到 Q(i+1)；若未用完 quantum 就主动让出（模拟 IO），则保持原级。最低级可用轮转。',
    en: 'Set up L queues Q0..Q(L-1) with Q0 highest. Each queue has its own quantum[i] (increasing with i). New processes enter Q0. The scheduler picks from the highest non-empty queue and runs for quantum[i]: if not done and the quantum was exhausted, demote to Q(i+1); if it yielded before the quantum (simulated IO), stay. The lowest level uses round-robin.',
  },
  tags: ['scheduling', 'mlfq', 'feedback', 'priority'],
  complexity: { time: 'O(总时间 * L)', space: 'O(n)' },
};
