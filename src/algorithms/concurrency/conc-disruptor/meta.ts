// Disruptor（Disruptor）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-disruptor',
  categoryId: 'concurrency',
  title: { zh: 'Disruptor', en: 'Disruptor' },
  summary: {
    zh: 'Disruptor：环形数组 + 序号栅栏，多生产者多消费者无锁管道。',
    en: 'Disruptor: ring array + sequence barriers for lockless multi-producer multi-consumer pipelines.',
  },
  description: {
    zh: 'Disruptor（LMAX）用固定大小环形数组 + 每消费者独立的 sequence。生产者申请槽位，消费者通过「栅栏」等待自己序号；所有协调通过 CAS 与 volatile，避免锁。',
    en: 'Disruptor (LMAX) uses a fixed-size ring array plus per-consumer sequences. Producers claim slots; consumers wait on their own sequence via barriers; coordination is via CAS and volatile reads, avoiding locks.',
  },
  tags: ['concurrency', 'queue', 'disruptor', 'ring-buffer', 'lockless', 'pipeline'],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};
