// SPSC 环形队列（SPSC Ring Buffer）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-spsc-ring',
  categoryId: 'concurrency',
  title: { zh: 'SPSC 环形队列', en: 'SPSC Ring Buffer' },
  summary: {
    zh: '单生产单消费的无锁环形。',
    en: 'Lock-free single-producer single-consumer ring.',
  },
  description: {
    zh: 'SPSC 环形队列用 head/tail 两个原子索引在定长数组上循环，生产者只写 tail，消费者只读 head，无需锁。',
    en: 'SPSC ring buffer uses atomic head/tail indices into a fixed array; producer owns tail, consumer owns head, no locks needed.',
  },
  tags: ['concurrency', 'spsc', 'ring-buffer', 'lock-free'],
  complexity: { time: 'O(1)', space: 'O(cap)' },
};
