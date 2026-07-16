// Barrier · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'barrier',
  categoryId: 'concurrency',
  title: { zh: '屏障', en: 'Cyclic Barrier' },
  summary: {
    zh: '循环屏障：n 个线程到达后统一放行，常用于阶段同步。',
    en: 'Cyclic barrier: release all n threads once they all arrive, used for phased synchronization.',
  },
  description: {
    zh: '屏障（Cyclic Barrier）是一种集合点同步原语：约定 `n` 个线程都到达屏障后才一起被放行，常用于分阶段计算（如阶段 0 全完成后才进入阶段 1）。\n\n- `await()`：到达并等待。内部计数 `arrived++`，返回是否为「最后到达者」。\n- 当第 n 个线程到达时触发放行：计数归零（可复用，即 cyclic），所有等待者被唤醒。\n\n本实现以「事件序列」确定性模拟若干线程依次到达，不真起线程，便于录制与测试。',
    en: 'A barrier is a rendezvous synchronization primitive: a set of `n` threads all reach the barrier before any are released, commonly used for phased computations (phase 0 completes before phase 1 begins).\n\n- `await()`: arrive and wait. Increments an internal counter `arrived`, returns whether the caller is the last to arrive.\n- When the n-th thread arrives, the barrier trips: the counter resets (reusable, hence "cyclic") and all waiters are released.\n\nThis implementation deterministically simulates threads arriving in sequence without real threads, for easy recording and testing.',
  },
  tags: ['concurrency', 'synchronization', 'barrier'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
};
