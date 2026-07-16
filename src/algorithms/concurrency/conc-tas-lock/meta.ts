// TAS 自旋锁（Test-and-Set Spinlock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-tas-lock',
  categoryId: 'concurrency',
  title: { zh: 'TAS 自旋锁', en: 'Test-and-Set Spinlock' },
  summary: {
    zh: 'TestAndSet 自旋锁：原子地测试并置位，失败则忙等。',
    en: 'TestAndSet spinlock: atomically test-and-set; spin on failure.',
  },
  description: {
    zh: 'TAS 自旋锁用一条原子指令 test-and-set：若 flag 为 0 则置 1 并获得锁；否则自旋。优点是实现极简、低延迟；缺点是在高竞争下总线流量大、无公平性。',
    en: 'TAS spinlock uses an atomic test-and-set: if flag is 0, set it to 1 and acquire; otherwise spin. Simple and low-latency, but high bus traffic under contention and no fairness.',
  },
  tags: ['concurrency', 'lock', 'spinlock', 'test-and-set'],
  complexity: { time: 'O(n) (per acquire, worst-case)', space: 'O(n)' },
};
