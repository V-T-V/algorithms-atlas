// TestAndSet 互斥锁 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-mutex-tas',
  categoryId: 'concurrency',
  title: { zh: 'TestAndSet 互斥锁', en: 'TestAndSet Mutex' },
  summary: {
    zh: '基于原子 TestAndSet 的忙等互斥锁：抢到 0 即进入临界区，释放写回 0。',
    en: 'Busy-wait mutex on atomic TestAndSet: seeing 0 grants the critical section; release writes 0.',
  },
  description: {
    zh: 'TestAndSet(addr) 原子地读取并写 1，返回旧值。lock() 反复执行直到拿到 0；unlock() 置 0。\n\n性质：互斥成立，但忙等浪费 CPU 且无公平性（可能饿死）。',
    en: 'TestAndSet(addr) atomically reads, writes 1, and returns the old value. lock() spins until it sees 0; unlock() writes 0.\n\nMutual exclusion holds, but busy-waiting wastes CPU and there is no fairness (starvation possible).',
  },
  tags: ['concurrency', 'mutex', 'test-and-set', 'mutual-exclusion'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
