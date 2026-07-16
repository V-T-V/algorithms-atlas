// Rate Monotonic · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rate-monotonic',
  categoryId: 'scheduling',
  title: { zh: '速率单调调度', en: 'Rate Monotonic Scheduling' },
  summary: {
    zh: '实时周期任务静态优先级调度：周期越短优先级越高，利用率须满足 Liu-Layland 上界。',
    en: 'Static-priority real-time scheduling for periodic tasks: shorter period means higher priority; utilization must satisfy the Liu-Layland bound.',
  },
  description: {
    zh: '速率单调调度（Rate Monotonic Scheduling, RMS）是硬实时系统中经典的「静态优先级、抢占式」调度算法，由 Liu 和 Layland 于 1973 年提出。\n\n核心规则：周期越短的任务优先级越高（「速率」= 1/周期，速率高者优先）。优先级在系统运行期间固定不变。\n\n可调度性判定（充分条件）：n 个独立周期任务的总利用率 U = Σ(Ci/Ti) 必须不超过上界 n·(2^(1/n) − 1)。当 n=1 时上界为 100%，n→∞ 时趋于约 69.3%。这是一个充分非必要条件——即使超过上界，具体任务集仍可能可调度，需用响应时间分析（RHS）精确判断。\n\nRMS 假设任务独立、周期等于截止期、无共享资源。当需要资源共享时通常采用「优先级天花板协议」防止优先级反转。',
    en: 'Rate Monotonic Scheduling (RMS) is a classic static-priority, preemptive scheduling algorithm for hard real-time systems, introduced by Liu and Layland in 1973.\n\nCore rule: the shorter the period, the higher the priority ("rate" = 1/period, higher rate first). Priorities are fixed for the system\'s lifetime.\n\nSchedulability test (sufficient condition): the total utilization U = Σ(Ci/Ti) of n independent periodic tasks must not exceed the bound n·(2^(1/n) − 1). The bound is 100% for n=1 and approaches ~69.3% as n→∞. This is sufficient but not necessary — exceeding it does not imply infeasibility; exact tests use response-time analysis.\n\nRMS assumes independent tasks with deadline = period and no shared resources. When resources are shared, the Priority Ceiling Protocol is typically used to prevent priority inversion.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n·H)', space: 'O(n)' },
};
