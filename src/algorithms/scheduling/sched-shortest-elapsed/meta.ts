// 最短已运行时间优先 (Shortest Elapsed Time) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-shortest-elapsed',
  categoryId: 'scheduling',
  title: { zh: '最短已运行时间优先 (SET)', en: 'Shortest Elapsed Time (SET)' },
  summary: {
    zh: '公平份额思想：每次选累计已获得 CPU 时间最少的进程运行一个时间片。',
    en: 'Fair-share idea: each round pick the process with the least accumulated CPU time and run it for one slice.',
  },
  description: {
    zh: '最短已运行时间优先（Shortest Elapsed Time, SET）是一种轮询式公平调度：每个时间片选累计已运行 CPU 时间最少的就绪进程运行。这样 CPU 被近似均分给所有进程，类似 lottery/stride 的均匀权重情形。若多个进程已运行时间相同，按到达顺序或 id 选择。',
    en: 'Shortest Elapsed Time (SET) is a round-robin-style fair scheduler: each slice runs the ready process with the least accumulated CPU time. CPU is thus distributed approximately equally among all processes, similar to the equal-weight case of lottery/stride. Ties are broken by arrival order or id.',
  },
  tags: ['scheduling', 'fair', 'elapsed-time', 'round-robin'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
