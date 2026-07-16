// 优先级抢占调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-priority-preempt-2',
  categoryId: 'scheduling',
  title: { zh: '优先级抢占调度', en: 'Priority Preemptive Scheduling' },
  summary: {
    zh: '每次选当前已到达中优先级最高（数值最小）的进程运行，新进程可抢占。',
    en: 'Always run the highest-priority (lowest number) arrived process; a new arrival can preempt the running one.',
  },
  description: {
    zh: '按时间步推进。每个时刻从已到达且未完成的进程中选优先级最高（数值最小）的运行 1 个时间单位。新进程到达时若优先级更高则抢占。可处理优先级相同（FCFS）。计算完成/等待/周转时间。',
    en: 'Advance one time unit at a time. At each instant pick the highest-priority (smallest number) unfinished arrived process and run it for 1 unit. A higher-priority arrival preempts the running process. Ties broken by FCFS. We compute completion/waiting/turnaround.',
  },
  tags: ['scheduling', 'priority', 'preemptive'],
  complexity: { time: 'O(总时间 * n)', space: 'O(n)' },
};
