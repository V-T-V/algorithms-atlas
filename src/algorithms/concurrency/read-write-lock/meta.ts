// 读写锁（读者优先）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'read-write-lock',
  categoryId: 'concurrency',
  title: { zh: '读写锁（读者优先）', en: 'Read-Write Lock (Reader-Preference)' },
  summary: {
    zh: '读者可并发进入，写者独占；读者优先可能导致写者饥饿。',
    en: 'Multiple readers enter concurrently, writers are exclusive; reader preference may starve writers.',
  },
  description: {
    zh: '读写锁区分两类访问：**读锁**（共享）与**写锁**（独占）。多个读者可同时持有读锁，但写锁独占——持有写锁时其他读写都阻塞。\n\n**读者优先**策略：\n- 读者到来时，若无写者持有/等待，则直接进入（readcount++）。\n- 第一个读者需竞争「全局资源锁」；最后一个读者释放时归还。\n- 写者到来时若已有读者或写者，则排队等待。\n\n性质：并发读吞吐高；但只要读者持续到来，写者可能长期得不到锁（**写者饥饿**）。这是与「写者优先」策略的权衡——后者保证写者不饿死但读者吞吐降低。\n\n事件序列模拟：按 readLock/readUnlock/writeLock/writeUnlock 事件确定性推进，统计最大并发读者数、写者等待情况。',
    en: 'A read-write lock distinguishes two access modes: **read lock** (shared) and **write lock** (exclusive). Multiple readers may hold the read lock simultaneously, but the write lock is exclusive — once held, all other reads and writes block.\n\n**Reader-preference** policy:\n- A reader arriving enters directly (readcount++) if no writer holds/is waiting.\n- The first reader also acquires a "resource lock"; the last reader releases it.\n- A writer arriving while readers or a writer are active queues to wait.\n\nProperties: high concurrent read throughput; but if readers keep arriving, a writer may wait indefinitely (**writer starvation**). This is the trade-off against "writer-preference", which prevents writer starvation at the cost of read throughput.\n\nThe event-sequence simulation deterministically processes readLock/readUnlock/writeLock/writeUnlock events, tracking max concurrent readers and writer waits.',
  },
  tags: ['concurrency', 'read-write-lock', 'shared-lock', 'exclusive-lock'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
