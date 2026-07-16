// 加权公平队列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-weighted-fair',
  categoryId: 'scheduling',
  title: { zh: '加权公平队列', en: 'Weighted Fair Queueing' },
  summary: { zh: '按权重分配 CPU 比例。', en: 'Allocate CPU proportionally by weight.' },
  description: { zh: '虚拟完成时间排序。', en: 'Sort by virtual finish time. O(n log n).' },
  tags: ['scheduling', 'wfq'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
