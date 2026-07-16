// Fast Path 互斥 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-fast-path',
  categoryId: 'concurrency',
  title: { zh: 'Fast Path 互斥', en: 'Fast Path Mutex' },
  summary: {
    zh: '无竞争时走快速路径（单次原子操作），有竞争才回退到慢路径。',
    en: 'Uncontended fast path with one atomic op; fall back to slow path only under contention.',
  },
  description: {
    zh: 'Fast Path 锁利用「大多数情况下无竞争」的观察：lock 先尝试一次原子 CAS（0→本线程），成功则直接进入（fast path）；失败说明有竞争，转入慢路径（入队、阻塞）。unlock 时若等待队列为空则同样一次 CAS 回到 0（fast path），否则唤醒一个等待者。这样无竞争开销接近一条原子指令。',
    en: 'The fast-path lock exploits the observation that most locks are uncontended: lock first attempts one atomic CAS (0 → self); on success it enters immediately (fast path), otherwise it falls back to the slow path (enqueue, block). On unlock, if no waiters exist it CASes back to 0 (fast path), otherwise it wakes one waiter. Uncontended cost approaches a single atomic instruction.',
  },
  tags: ['concurrency', 'mutex', 'fast-path', 'optimization'],
  complexity: { time: 'O(1) 期望', space: 'O(n)' },
};
