// 互斥锁（Mutex / TestAndSet）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mutex',
  categoryId: 'concurrency',
  title: { zh: '互斥锁（TestAndSet）', en: 'Mutex (TestAndSet)' },
  summary: {
    zh: '基于原子 TestAndSet 指令实现的互斥锁：忙等抢锁、显式释放。',
    en: 'Mutual exclusion lock built on the atomic TestAndSet instruction: busy-wait acquire, explicit release.',
  },
  description: {
    zh: '互斥锁保证同一时刻至多一个线程进入临界区。最朴素的硬件实现用一条原子指令 **TestAndSet(addr)**：它原子地读取 `*addr` 并写入 1，返回旧值。\n\n- **lock()**：循环执行 `while (TestAndSet(&flag) === 1) ;`（被占用则忙等），直到拿到 0（锁空闲）并把它置 1。\n- **unlock()**：把 flag 写回 0。\n\n性质：互斥成立（只有一个线程能读到 0）；但忙等浪费 CPU，且不保证公平（可能饿死）。事件序列模拟用一组 lock/critical/unlock 事件确定性推进：lock 时若 flag=0 则进入临界区，否则该线程进入「等待队列」；unlock 时唤醒队首等待者。\n\n本实现附带回退（backoff）演示：抢锁失败次数越多，等待越久，减少总线争用。',
    en: 'A mutex guarantees at most one thread enters the critical section at a time. The simplest hardware implementation uses an atomic **TestAndSet(addr)** instruction: it atomically reads `*addr`, writes 1, and returns the old value.\n\n- **lock()**: spin on `while (TestAndSet(&flag) === 1) ;` until it sees 0 (free) and sets it to 1.\n- **unlock()**: write 0 to flag.\n\nProperties: mutual exclusion holds (only one thread sees 0); but busy-waiting wastes CPU and there is no fairness guarantee (possible starvation). The event-sequence simulation deterministically processes lock/critical/unlock events: on lock, if flag=0 enter the critical section, otherwise enqueue; on unlock, wake the head waiter.\n\nThis implementation also demonstrates a backoff policy: more failed attempts mean longer waits, reducing bus contention.',
  },
  tags: ['concurrency', 'mutex', 'test-and-set', 'mutual-exclusion', 'busy-wait'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
