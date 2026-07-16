// 保证调度（Guaranteed Scheduling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'guaranteed-scheduling',
  categoryId: 'scheduling',
  title: { zh: '保证调度（Guaranteed）', en: 'Guaranteed Scheduling' },
  summary: {
    zh: '承诺每个进程至少获得 1/n 的 CPU；按实际/应得比最低者优先。',
    en: 'Promise each process at least 1/n of CPU; run the process with lowest actual/entitled ratio.',
  },
  description: {
    zh: '保证调度（也称 Guaranteed Scheduling）向每个进程承诺：在 n 个进程时至少获得 1/n 的 CPU。实现上跟踪每个进程的实际 CPU 占用率与应得率（1/n），调度时优先运行「实际/应得比」最小的进程，从而把承诺落到实处。\n\n- 应得率 = 1 / 当前活跃进程数\n- 每个时间单位选 usedRatio = 实际率 / 应得率 最低的进程\n- 运行后更新其累计 CPU\n\n这是 fair-share 在「进程级」的简化版。',
    en: 'Guaranteed Scheduling promises each process at least 1/n of CPU. It tracks each process actual-vs-entitled ratio (entitled = 1/n) and runs the process with the lowest ratio each tick, fulfilling the promise. A process-level simplification of fair-share.',
  },
  tags: ['scheduling', 'guaranteed', 'fairness', 'ratio-based'],
  complexity: { time: 'O(n · T)', space: 'O(n)' },
};
