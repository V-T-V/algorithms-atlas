// Exchanger 双向交换（Exchanger）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-exchanger',
  categoryId: 'concurrency',
  title: { zh: 'Exchanger 双向交换', en: 'Exchanger' },
  summary: { zh: '两线程在汇合点交换数据。', en: 'Two threads swap data at a rendezvous.' },
  description: {
    zh: 'Exchanger 让两个线程在汇合点互相交换缓冲区，常用于流水线:一个填充、一个消费，无需显式同步。',
    en: 'Exchanger lets two threads swap buffers at a rendezvous, common in pipelines (one fills, one drains) without explicit sync.',
  },
  tags: ['concurrency', 'exchanger', 'rendezvous'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
