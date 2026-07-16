// 监视器对象（Monitor Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-monitor-object',
  categoryId: 'design',
  title: { zh: '监视器对象', en: 'Monitor Object' },
  summary: { zh: '对象内条件变量同步。', en: 'Synchronize via condition variables.' },
  description: {
    zh: '监视器对象模式把对象方法互斥化，并提供条件变量让方法等待/通知，保证对象内部不变量，Java synchronized 即此模式。',
    en: 'The Monitor Object pattern serializes methods and provides condition variables for wait/notify, preserving invariants; Java synchronized embodies it.',
  },
  tags: ['design', 'pattern', 'monitor', 'concurrency'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
