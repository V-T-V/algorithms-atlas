// 最早截止时间优先（EDF）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'earliest-deadline-first',
  categoryId: 'scheduling',
  title: { zh: '最早截止时间优先', en: 'Earliest Deadline First (EDF)' },
  summary: {
    zh: '实时抢占式调度：每个时刻运行绝对截止期最早的就绪作业，利用率 100% 可调度。',
    en: 'Preemptive real-time scheduling: at each instant run the ready job with the earliest absolute deadline; 100% utilization is schedulable.',
  },
  description: {
    zh: '最早截止时间优先（Earliest Deadline First, EDF）是实时系统中最著名的**动态优先级、抢占式**调度算法。\n\n规则：\n- 每个作业有一个**绝对截止期**（absolute deadline）。\n- 任意时刻，调度器选择就绪作业中**截止期最早**的运行。\n- 一旦有更早截止期的作业就绪，立即抢占当前作业。\n\n**最优性**（Liu & Layland 1973）：对单处理器上的独立周期任务，只要总利用率 U = Σ(Ci/Ti) ≤ 1（100%），EDF 一定可调度（必要且充分）。这比静态优先级的 RMS（上界约 69.3%）更强。\n\n**缺点**：\n- 实现需要动态优先级计算（每次选最小截止期）。\n- 过载时行为不稳定（多米诺式错过截止期，不像 RMS 有可预测的退化）。\n\n本实现支持非周期作业（给定到达、执行、截止期），逐时间单位抢占式推进，并统计是否错过截止期。',
    en: "Earliest Deadline First (EDF) is the best-known **dynamic-priority, preemptive** scheduling algorithm for real-time systems.\n\nRules:\n- Each job has an **absolute deadline**.\n- At every instant the scheduler runs the ready job with the **earliest deadline**.\n- A newly-ready job with an earlier deadline preempts the running one immediately.\n\n**Optimality** (Liu & Layland 1973): for independent periodic tasks on a single processor, EDF is schedulable if and only if total utilization U = Σ(Ci/Ti) ≤ 1 (100%). This is stronger than the static-priority RMS bound (~69.3%).\n\n**Drawbacks**:\n- Implementation needs dynamic priority (pick min deadline each time).\n- Behavior under overload is unstable (domino deadline misses, unlike RMS's predictable degradation).\n\nThis implementation supports aperiodic jobs (given arrival, execution, deadline), advancing preemptively per time unit and tracking missed deadlines.",
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n·H)', space: 'O(n)' },
};
