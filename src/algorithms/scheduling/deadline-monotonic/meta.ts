// 截止单调调度（Deadline Monotonic, DM）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'deadline-monotonic',
  categoryId: 'scheduling',
  title: { zh: '截止单调调度（DM）', en: 'Deadline Monotonic (DM)' },
  summary: {
    zh: '静态优先级：相对截止期越短优先级越高（截止期可与周期不同）。',
    en: 'Static priority: shorter relative deadline = higher priority (deadline may differ from period).',
  },
  description: {
    zh: '截止单调调度（Deadline Monotonic, DM）是实时周期任务的静态优先级调度，是速率单调（RM）的推广：当任务的相对截止期 D 不等于周期 T 时，按 D 升序分配固定优先级（D 越小优先级越高）。\n\n- D = T 时退化为 RM\n- D < T（紧截止期）时 DM 比 RM 更优\n- 静态优先级，运行时按优先级抢占式调度\n\n本实现做时间步进仿真：每个时间单位选当前已就绪、且优先级最高（D 最小）的任务执行，检查是否在截止期内完成。',
    en: 'Deadline Monotonic (DM) is a static-priority real-time scheduler generalizing RM: tasks have a relative deadline D that may differ from period T; priority is assigned by ascending D. When D=T it reduces to RM; when D<T it beats RM. This implementation simulates preemptive time-stepped execution and checks deadline feasibility.',
  },
  tags: ['scheduling', 'real-time', 'deadline-monotonic', 'static-priority', 'preemptive'],
  complexity: { time: 'O(H · n)', space: 'O(n)' },
};
