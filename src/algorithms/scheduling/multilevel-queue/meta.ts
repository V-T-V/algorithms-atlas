// 多级队列调度（Multilevel Queue）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'multilevel-queue',
  categoryId: 'scheduling',
  title: { zh: '多级队列调度', en: 'Multilevel Queue Scheduling' },
  summary: {
    zh: '进程按类型分入固定优先级队列，队列间用固定优先级抢占调度。',
    en: 'Processes are placed into fixed-priority queues by type; queues are scheduled by fixed priority with preemption.',
  },
  description: {
    zh: "多级队列调度把就绪进程划分到多个独立队列，每个队列有自己的调度算法，队列之间用固定的优先级关系调度。\n\n典型划分（优先级从高到低）：\n1. **系统进程**（前台交互）—— 最高优先级，常用 RR。\n2. **交互式进程** —— RR。\n3. **批处理进程** —— FCFS。\n\n**队列间调度**有两种策略：\n- **固定优先级**（本实现）：高优先级队列非空时，低优先级队列得不到 CPU（可能饿死）。\n- **时间片划分**：每个队列分配一定比例的 CPU 时间。\n\n进程一旦分入某队列就不再迁移（与多级反馈队列 MLFQ 不同）。每个队列内部可使用任意算法（RR / FCFS / 优先级等）。\n\n本实现支持任意数量队列，每个队列指定优先级、调度算法（'rr' 或 'fcfs'）和时间片。",
    en: "Multilevel Queue Scheduling partitions ready processes into multiple independent queues, each with its own algorithm; queues are scheduled relative to each other by a fixed priority.\n\nTypical partition (highest priority first):\n1. **System processes** (foreground interactive) — highest priority, usually RR.\n2. **Interactive processes** — RR.\n3. **Batch processes** — FCFS.\n\n**Inter-queue scheduling** has two strategies:\n- **Fixed priority** (this implementation): lower-priority queues get CPU only when all higher-priority queues are empty (may starve).\n- **Time slicing**: each queue receives a fraction of CPU time.\n\nOnce a process is assigned to a queue it never migrates (unlike MLFQ). Each queue may use any internal algorithm (RR / FCFS / priority, etc.).\n\nThis implementation supports any number of queues, each with a priority, an algorithm ('rr' or 'fcfs'), and a quantum.",
  },
  tags: ['scheduling', 'multilevel-queue', 'preemptive', 'fixed-priority'],
  complexity: { time: 'O(Q·n)', space: 'O(n)' },
};
