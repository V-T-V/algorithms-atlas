// 工作窃取（Work-Stealing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'work-stealing',
  categoryId: 'concurrency',
  title: { zh: '工作窃取', en: 'Work-Stealing' },
  summary: {
    zh: '每个 worker 拥有双端队列：本地 LIFO，空闲时从别人队列尾偷（FIFO）。',
    en: "Each worker owns a deque: local LIFO push/pop, idle workers steal FIFO from others' tail.",
  },
  description: {
    zh: '工作窃取（Work-Stealing）是 Fork-Join 框架（如 Java ForkJoinPool、Cilk）的核心调度策略：\n\n- 每个 worker 拥有自己的**双端队列（deque）**。\n- 产生新任务时，**push** 到自己 deque 的**头部**（LIFO 端，缓存友好且深度优先）。\n- 取任务时，从自己 deque 的**头部 pop**（LIFO）。\n- 当自己 deque 空时，从**其他 worker 的 deque 尾部 steal**（FIFO 端，偷「最老」的大任务，减少再分裂）。\n\n设计要点：\n- 本地操作（push/pop）无锁或低争用；只有 steal 跨 worker，争用少。\n- LIFO 让本地处理偏向「最新分裂的子任务」（深度优先），有利于缓存局部性。\n- Steal 取尾部的「老」任务，通常粒度更大，减少窃取频率。\n\n事件序列模拟：N 个 worker 各自 push/pop，空 worker 随机/轮转选择受害者 steal，统计负载均衡情况。',
    en: 'Work-Stealing is the core scheduling policy of Fork-Join frameworks (Java ForkJoinPool, Cilk):\n\n- Each worker owns its own **deque**.\n- When spawning a new task, **push** to its deque **head** (LIFO end, cache-friendly and depth-first).\n- When taking work, **pop** from its deque **head** (LIFO).\n- When its deque is empty, **steal** from the **tail** of another worker\'s deque (FIFO end, the "oldest" usually larger task).\n\nDesign rationale:\n- Local operations (push/pop) are lock-free or low-contention; only steal crosses workers, so contention is rare.\n- LIFO biases local processing toward the most-recently-spawned subtask (depth-first), aiding cache locality.\n- Stealing the tail takes older, usually coarser tasks, reducing steal frequency.\n\nThe event-sequence simulation has N workers push/pop locally; idle workers pick a victim (round-robin/random) to steal from, tracking load balance.',
  },
  tags: ['concurrency', 'work-stealing', 'deque', 'fork-join', 'scheduling'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
