// 循环执行调度 (Cyclic Executive) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-cyclic-executive',
  categoryId: 'scheduling',
  title: { zh: '循环执行调度 (Cyclic Executive)', en: 'Cyclic Executive Scheduling' },
  summary: {
    zh: '静态表驱动：把周期任务安排到固定小循环（帧）中循环执行，时序完全确定。',
    en: 'Static table-driven: periodic tasks are laid out into fixed minor frames that repeat, giving fully deterministic timing.',
  },
  description: {
    zh: '循环执行（Cyclic Executive）是硬实时系统中经典的静态调度方式。时间被划分为等长的「小循环（minor cycle / frame）」，若干小循环组成一个「大循环（major cycle）」。每个任务按其周期被分配到固定的小循环中执行，整个大循环不断重复。优点是时序完全确定、易于验证；缺点是不灵活（任务集变更需重新生成调度表）。本实现根据任务周期生成调度表并验证可调度性（每帧总执行 ≤ 帧长）。',
    en: 'Cyclic Executive is a classic static scheduling scheme for hard real-time. Time is split into equal-length minor frames; several frames form a major cycle. Each task is placed into fixed frames according to its period, and the whole major cycle repeats. The benefit is fully deterministic, easily verifiable timing; the drawback is inflexibility (changing the task set requires regenerating the schedule table). This implementation builds a schedule table from task periods and checks feasibility (total execution per frame ≤ frame length).',
  },
  tags: ['scheduling', 'real-time', 'cyclic', 'static', 'table-driven'],
  complexity: { time: 'O(n·F)', space: 'O(F)' },
};
