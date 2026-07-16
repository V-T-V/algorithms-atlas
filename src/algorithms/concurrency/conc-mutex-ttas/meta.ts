// Test-Test-And-Set 互斥锁 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-mutex-ttas',
  categoryId: 'concurrency',
  title: { zh: 'Test-Test-And-Set 锁', en: 'Test-Test-And-Set Lock' },
  summary: {
    zh: '先读 flag（test），空闲再 TestAndSet，减少争用的两级自旋锁。',
    en: 'Two-level spin: first read flag, only TestAndSet when it looks free; reduces contention.',
  },
  description: {
    zh: 'TTAS 在 TestAndSet 之外增加一层「纯读」自旋：当 flag=1 时只读不自写，避免在已被占用时反复触发总线写。当读到 0 再执行一次 TestAndSet；若失败则回到读自旋。在缓存一致性（MESI）下读自旋命中本地缓存，争用显著降低。',
    en: 'TTAS adds a read-only spin level around TestAndSet: while flag=1 it only reads (no writes), avoiding repeated bus traffic. When it reads 0 it performs one TestAndSet; on failure it falls back to the read spin. Under cache coherence (MESI) reads hit local cache, reducing contention.',
  },
  tags: ['concurrency', 'mutex', 'ttas', 'spinlock'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
