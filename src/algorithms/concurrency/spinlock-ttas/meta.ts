// Test-and-Test-and-Set 自旋锁 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'spinlock-ttas',
  categoryId: 'concurrency',
  title: { zh: 'TTAS 自旋锁', en: 'Test-and-Test-and-Set Spinlock' },
  summary: {
    zh: '先读标志再 TestAndSet：减少总线争用，是经典自旋锁优化。',
    en: 'Read the flag before issuing TestAndSet: cuts bus contention, a classic spinlock optimization.',
  },
  description: {
    zh: '朴素 TestAndSet 自旋锁每次循环都发一条原子写指令（TestAndSet），即使锁被占用也持续争抢总线，导致严重性能下降。\n\n**TTAS（Test-and-Test-and-Set）** 优化：\n```\nwhile (true) {\n  while (flag === 1) ;          // 普通读：等待锁变空闲（无总线争用）\n  if (TestAndSet(&flag) === 0)  // 变空闲的瞬间才发原子指令\n    return;                     // 拿到锁\n}\n```\n\n内层用「普通读」自旋（缓存命中，几乎无开销），只有当读到 flag=0（可能空闲）时才发一条 TestAndSet 原子指令。若多个线程同时看到空闲，仍会有短暂争抢，但争抢频率远低于朴素版本。\n\n性能特性：在缓存一致性协议（MESI）下，普通读自旋让 flag 所在缓存行保持 S（共享）态，开销极小；锁释放时一次失效广播唤醒等待者。指数回退（backoff）进一步降低争用。',
    en: 'A plain TestAndSet spinlock issues an atomic write every iteration, hammering the bus even while the lock is held, which destroys performance.\n\n**TTAS (Test-and-Test-and-Set)** optimization:\n```\nwhile (true) {\n  while (flag === 1) ;          // plain read: spin until free (no bus traffic)\n  if (TestAndSet(&flag) === 0)  // only fire atomic when possibly free\n    return;                     // got it\n}\n```\n\nThe inner loop spins on a "plain read" (cache hit, near-zero cost) and only fires an atomic TestAndSet when it reads flag=0 (possibly free). If several threads see free simultaneously there is brief contention, but far less than the plain version.\n\nPerformance: under MESI cache coherence, plain-read spinning keeps the flag\'s cache line in S (shared) state at near-zero cost; release invalidates once to wake waiters. Exponential backoff further reduces contention.',
  },
  tags: ['concurrency', 'spinlock', 'ttas', 'busy-wait', 'cache-coherence'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
