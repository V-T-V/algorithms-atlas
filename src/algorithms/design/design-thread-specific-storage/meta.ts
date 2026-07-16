// 线程专属存储（Thread-Specific Storage）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-thread-specific-storage',
  categoryId: 'design',
  title: { zh: '线程专属存储', en: 'Thread-Specific Storage' },
  summary: { zh: '每线程独立副本避免锁。', en: 'Per-thread copy avoids locks.' },
  description: {
    zh: '线程专属存储模式为每线程维护数据副本(线程局部变量)，访问无需加锁，常见于连接、事务、日志缓冲区。',
    en: 'Thread-Specific Storage keeps a per-thread data copy (thread-local) accessed without locks; used for connections, transactions, log buffers.',
  },
  tags: ['design', 'pattern', 'thread-local', 'concurrency'],
  complexity: { time: 'O(1)', space: 'O(t)' },
};
