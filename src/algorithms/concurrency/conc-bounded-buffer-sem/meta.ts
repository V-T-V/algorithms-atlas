// 信号量有界缓冲（Semaphore Bounded Buffer）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-bounded-buffer-sem',
  categoryId: 'concurrency',
  title: { zh: '信号量有界缓冲', en: 'Semaphore Bounded Buffer' },
  summary: {
    zh: 'empty/full 信号量同步生产消费。',
    en: 'empty/full semaphores sync producer/consumer.',
  },
  description: {
    zh: '经典有界缓冲用两个计数信号量 empty、full 与互斥锁配合：生产者等 empty，消费者等 full，缓冲大小固定。',
    en: 'The classic bounded buffer uses empty/full counting semaphores plus a mutex: producers wait on empty, consumers on full.',
  },
  tags: ['concurrency', 'semaphore', 'bounded-buffer', 'producer-consumer'],
  complexity: { time: 'O(1) per op', space: 'O(cap)' },
};
