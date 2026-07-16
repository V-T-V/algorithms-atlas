// 有界缓冲锁版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-bounded-buffer-lock',
  categoryId: 'concurrency',
  title: { zh: '有界缓冲（锁版）', en: 'Bounded Buffer (Lock-based)' },
  summary: {
    zh: '用互斥锁 + 两个计数信号量实现有界缓冲的生产-消费。',
    en: 'Bounded-buffer producer-consumer with a mutex and two counting semaphores.',
  },
  description: {
    zh: '经典方案：信号量 empty=容量（空槽）、full=0（满槽）、互斥锁 mutex。生产者 P(empty); P(mutex); 放入; V(mutex); V(full)；消费者 P(full); P(mutex); 取出; V(mutex); V(empty)。',
    en: 'Classic scheme: semaphores empty=capacity, full=0, and a mutex. Producer does P(empty); P(mutex); put; V(mutex); V(full); consumer does P(full); P(mutex); get; V(mutex); V(empty).',
  },
  tags: ['concurrency', 'bounded-buffer', 'semaphore', 'producer-consumer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
