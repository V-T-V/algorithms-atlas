// 反馈队列调度 (Feedback Queue) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-feedback-queue',
  categoryId: 'scheduling',
  title: { zh: '多级反馈队列 (MLFQ)', en: 'Multilevel Feedback Queue (MLFQ)' },
  summary: {
    zh: '多级优先级队列，进程用完时间片降级，I/O 阻塞不降级，兼顾响应与公平。',
    en: 'Multiple priority queues; a process using up its quantum is demoted while I/O-blocked ones stay, balancing response and fairness.',
  },
  description: {
    zh: '多级反馈队列（Multilevel Feedback Queue, MLFQ）通过动态调整进程优先级来同时照顾交互式响应与长作业吞吐。进程初始进入最高优先级队列；若用完当前层时间片仍未完成，则降级到下一层（时间片更长）；若因 I/O 主动让出 CPU，则留在原层甚至升级。最低层通常按 RR 处理。本实现用层数 L 和倍增时间片演示降级过程，并加入「优先级提升」防饥饿。',
    en: 'Multilevel Feedback Queue (MLFQ) dynamically adjusts process priority to serve both interactive response and long-job throughput. A process starts in the highest-priority queue; if it exhausts its quantum without finishing it is demoted to a lower level (longer quantum); if it yields on I/O it stays put or is promoted. The lowest level is usually plain RR. This implementation uses L levels with exponentially growing quantums and periodic priority boosts to avoid starvation.',
  },
  tags: ['scheduling', 'mlfq', 'feedback', 'preemptive', 'priority'],
  complexity: { time: 'O(n·L)', space: 'O(n)' },
};
