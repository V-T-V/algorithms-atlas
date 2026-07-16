// 公平调度 (Stride Scheduling) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-fair-scheduling-2',
  categoryId: 'scheduling',
  title: { zh: '步幅调度 (Stride Scheduling)', en: 'Stride Scheduling' },
  summary: {
    zh: '按份额反比设定步幅，每轮选 pass 值最小的进程，长期精确按权重分配 CPU。',
    en: 'Set stride inversely proportional to weight; pick the min-pass process each round to allocate CPU in exact proportion.',
  },
  description: {
    zh: '步幅调度（Stride Scheduling, Waldspurger & Weihl 1995）是一种确定性公平调度算法。每个进程有一个权重 weight，步幅 stride = L/weight（L 为常数），以及一个累计 pass 值。每轮选 pass 最小者运行一步，pass += stride。长期看每进程获得的步数正比于其权重，误差 ≤ 1 步。',
    en: 'Stride Scheduling (Waldspurger & Weihl 1995) is a deterministic fair scheduling algorithm. Each process has a weight, stride = L/weight (L a constant), and an accumulated pass value. Each round the min-pass process runs one stride, pass += stride. Over the long run each process gets steps proportional to its weight, error ≤ 1 stride.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
