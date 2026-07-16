// 最短进程优先 (SPN) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-shortest-process-next',
  categoryId: 'scheduling',
  title: { zh: '最短进程优先 (SPN)', en: 'Shortest Process Next (SPN)' },
  summary: {
    zh: '非抢占式：从就绪进程中选估计执行时间最短者运行，降低平均等待。',
    en: 'Non-preemptive: among ready processes pick the one with the shortest estimated run time, lowering average wait.',
  },
  description: {
    zh: '最短进程优先（Shortest Process Next, SPN，又称 SJN/SJF 非抢占版）每次从已到达的进程中选执行时间最短者运行到完成。它最小化平均等待时间，但需要预知执行时间，且长进程可能饥饿。本实现用估计时间 selection，并提供 aging 防饥饿选项。',
    en: 'Shortest Process Next (SPN, also the non-preemptive SJN/SJF) picks, among ready processes, the one with the shortest run time and runs it to completion. It minimizes average waiting time but requires knowing run times in advance and may starve long processes. This implementation selects by estimated time and supports an aging option to prevent starvation.',
  },
  tags: ['scheduling', 'sjf', 'non-preemptive', 'shortest-job'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
