// 速率单调响应时间分析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-rate-monotonic-2',
  categoryId: 'scheduling',
  title: { zh: '速率单调响应时间分析 (RTA)', en: 'Rate Monotonic Response Time Analysis' },
  summary: {
    zh: 'RMS 精确可调度性测试：迭代求响应时间 R = C + Σ⌈R/T⌉·C，与 D 比较。',
    en: 'Exact schedulability test for RMS: iteratively compute response time R = C + Σ⌈R/T⌉·C and compare to D.',
  },
  description: {
    zh: 'Liu-Layland 上界只是 RMS 可调度的充分条件，过于保守。响应时间分析（Response Time Analysis, RTA）是精确的充分必要判定：对每个任务 τi，按优先级从高到低迭代求解 R_i^(k+1) = C_i + Σ_{j<i} ⌈R_i^(k)/T_j⌉·C_j。若序列收敛且 R_i ≤ D_i 则可调度；若超过 D_i 则不可调度；若单调发散则不可调度。本实现完成迭代并返回每个任务的响应时间。',
    en: 'The Liu-Layland bound is only a sufficient (conservative) schedulability test for RMS. Response Time Analysis (RTA) is exact: for each task τi, iterate R_i^(k+1) = C_i + Σ_{j<i} ⌈R_i^(k)/T_j⌉·C_j in priority order. The task is schedulable if the sequence converges with R_i ≤ D_i; it fails if R_i exceeds D_i or diverges. This implementation performs the iteration and returns each tasks response time.',
  },
  tags: ['scheduling', 'real-time', 'rms', 'response-time-analysis', 'schedulability'],
  complexity: { time: 'O(n²·R)', space: 'O(n)' },
};
