// 协程模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-coroutine',
  categoryId: 'design',
  title: { zh: '协程模式', en: 'Coroutine Pattern' },
  summary: {
    zh: '协程：用生成器实现可暂停/恢复的协作式调度，状态机式异步。',
    en: 'Coroutine: cooperative suspendable scheduling via generators, FSM-style async without threads.',
  },
  description: {
    zh: '协程模式（并发）：\n\n- Generator 函数 yield 控制点，调用方 next() 恢复。\n- 协作式多任务：协程自己 yield 让出，无抢占。\n- 单线程内多协程交替执行，无锁开销。\n- 经典应用：JS async/await、Python asyncio、迭代器、状态机、游戏脚本。\n\n本实现：基于 generator 的简单调度器，轮流调度多个任务协程。',
    en: 'Coroutine Pattern (concurrency):\n\n- Generator functions yield at control points; the caller resumes via next().\n- Cooperative multitasking: coroutines yield themselves; no preemption.\n- Multiple coroutines alternate within one thread, no lock overhead.\n- Classic uses: JS async/await, Python asyncio, iterators, FSMs, game scripts.\n\nThis implementation: a generator-based scheduler round-robining multiple task coroutines.',
  },
  tags: ['design', 'concurrency', 'generator', 'cooperative'],
  complexity: { time: 'O(total steps)', space: 'O(coroutines)' },
};
