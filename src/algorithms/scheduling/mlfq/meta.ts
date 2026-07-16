// 多级反馈队列（MLFQ）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mlfq',
  categoryId: 'scheduling',
  title: { zh: '多级反馈队列', en: 'Multilevel Feedback Queue (MLFQ)' },
  summary: {
    zh: '进程可在队列间迁移：用完时间片降级，I/O 促留高优先级，兼顾响应与吞吐。',
    en: 'Processes migrate between queues: demoted when they exhaust their quantum, kept high for I/O; balances responsiveness and throughput.',
  },
  description: {
    zh: '多级反馈队列（MLFQ）是多级队列的改进版：进程**可在队列间迁移**，通过观察进程行为动态调整优先级。\n\n核心规则（参考 OSTEP）：\n1. **入队**：新进程进入最高优先级队列（Q0）。\n2. **调度**：始终运行最高优先级非空队列的队首；同队列内用 RR（每层时间片递增，如 Q0=2, Q1=4, Q2=8）。\n3. **降级**：进程用完当前层的时间片（quantum）后，降到下一层（优先级更低，时间片更大）。\n4. **提升**（防饿死）：周期性把所有进程提升回最高优先级（priority boost）。\n5. **I/O 友好**：进程在时间片用完前主动让出（如做 I/O），保留在当前层（不降级）——奖励交互式短任务。\n\n效果：短任务很快在高优先级层完成（响应好）；长任务逐渐降到低层，CPU 密集型任务用大时间片批量跑（吞吐高）。本实现含「用完降级」与可选「周期提升」。',
    en: 'Multilevel Feedback Queue (MLFQ) improves on multilevel queues: processes **migrate between queues**, with priority adjusted dynamically by observing their behavior.\n\nCore rules (per OSTEP):\n1. **Entry**: a new process enters the highest-priority queue (Q0).\n2. **Scheduling**: always run the head of the highest-priority non-empty queue; within a queue use RR (quantum increases per level, e.g. Q0=2, Q1=4, Q2=8).\n3. **Demotion**: when a process exhausts its current-level quantum, it drops one level (lower priority, larger quantum).\n4. **Boost** (anti-starvation): periodically promote all processes back to the top (priority boost).\n5. **I/O-friendly**: a process that yields before exhausting its quantum (e.g. for I/O) stays at its current level (not demoted) — rewarding short interactive jobs.\n\nEffect: short jobs finish quickly at high priority (good responsiveness); long jobs sink to lower levels where CPU-bound work runs in larger chunks (good throughput). This implementation includes "demote on quantum exhaustion" and optional "periodic boost".',
  },
  tags: ['scheduling', 'mlfq', 'feedback', 'preemptive', 'adaptive'],
  complexity: { time: 'O(L·n)', space: 'O(n)' },
};
