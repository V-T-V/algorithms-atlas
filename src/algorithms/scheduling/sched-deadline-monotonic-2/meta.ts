// 截止单调响应时间分析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-deadline-monotonic-2',
  categoryId: 'scheduling',
  title: { zh: '截止单调响应时间分析', en: 'Deadline Monotonic Response Time Analysis' },
  summary: {
    zh: 'DM 的精确可调度性：按相对截止期升序定优先级，迭代求响应时间 R 与 D 比较。',
    en: 'Exact schedulability for DM: priority by relative deadline ascending; iterate response time R and compare to D.',
  },
  description: {
    zh: '截止单调调度（DM）在任务相对截止期 D 小于周期 T（约束截止期）时优于 RMS。本算法用响应时间分析精确判定可调度性：优先级按 D 升序（D 越小越高），对每个任务 τi 迭代 R_i = C_i + Σ_{j<i}⌈R_i/T_j⌉·C_j。收敛且 R_i ≤ D_i 则可调度。相比仅充分条件的密度判定更精确。',
    en: 'Deadline Monotonic (DM) beats RMS when relative deadlines D are smaller than periods T (constrained deadlines). This algorithm uses response time analysis to decide schedulability exactly: priorities by D ascending (smaller D = higher), iterating R_i = C_i + Σ_{j<i}⌈R_i/T_j⌉·C_j per task. Convergence with R_i ≤ D_i means schedulable. More precise than the merely-sufficient density test.',
  },
  tags: ['scheduling', 'real-time', 'deadline-monotonic', 'response-time-analysis'],
  complexity: { time: 'O(n²·R)', space: 'O(n)' },
};
