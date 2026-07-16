// Bounded Buffer (Producer-Consumer, PV) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'producer-consumer-bounded',
  categoryId: 'concurrency',
  title: { zh: '有界缓冲（PV 经典）', en: 'Bounded Buffer (Classic PV)' },
  summary: {
    zh: '用信号量 empty/full/mutex 模拟有界缓冲区的生产-消费，PV 操作经典模型。',
    en: 'Classic PV model: semaphore empty/full/mutex governing a bounded buffer between producers and consumers.',
  },
  description: {
    zh: '有界缓冲生产-消费者是操作系统中信号量（PV 操作）的经典案例。三个信号量协同：\n\n- `empty`（初值 = 容量）：剩余空槽数。生产者 P(empty)，消费者 V(empty)。\n- `full`（初值 = 0）：已填满槽数。生产者 V(full)，消费者 P(full)。\n- `mutex`（初值 = 1）：对缓冲区的互斥访问（二元信号量）。\n\n生产者：`P(empty); P(mutex); 放入; V(mutex); V(full)`\n消费者：`P(full); P(mutex); 取出; V(mutex); V(empty)`\n\n注意 P(empty)/P(full) 必须在 P(mutex) **之前**，否则可能死锁（持有互斥锁却因缓冲满/空而阻塞）。本实现用确定性「操作序列」模拟，跟踪三个信号量的值与缓冲区内容，验证不溢出/不空取。',
    en: 'The bounded-buffer producer-consumer is the canonical semaphore (P/V) example in operating systems. Three semaphores cooperate:\n\n- `empty` (init = capacity): free slots. Producers P(empty), consumers V(empty).\n- `full` (init = 0): filled slots. Producers V(full), consumers P(full).\n- `mutex` (init = 1): mutual exclusion over the buffer (binary semaphore).\n\nProducer: `P(empty); P(mutex); deposit; V(mutex); V(full)`\nConsumer: `P(full); P(mutex); remove; V(mutex); V(empty)`\n\nNote P(empty)/P(full) must come BEFORE P(mutex), or deadlock may occur (holding the mutex yet blocking on a full/empty buffer). This implementation simulates a deterministic operation sequence, tracking the three semaphores and buffer contents to verify no overflow / no underflow.',
  },
  tags: ['concurrency', 'producer-consumer', 'semaphore', 'bounded-buffer'],
  complexity: { time: 'O(m)', space: 'O(capacity)' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
};
