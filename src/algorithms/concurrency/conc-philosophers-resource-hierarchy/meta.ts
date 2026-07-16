// 资源层级哲学家 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-philosophers-resource-hierarchy',
  categoryId: 'concurrency',
  title: { zh: '资源层级哲学家', en: 'Resource-Hierarchy Dining Philosophers' },
  summary: {
    zh: '所有哲学家先拿编号小的叉再拿编号大的，破坏循环等待。',
    en: 'All philosophers acquire the lower-numbered fork first, breaking circular wait.',
  },
  description: {
    zh: 'Dijkstra 资源层级法：把叉子按 id 全序化，规定先取小号叉再取大号叉。这样不会出现「每人持一把叉等另一把」的环路，死锁消除。n 个哲学家 P_i 的两叉为 F_i 和 F_{(i+1)%n}；P_i 若 i 为偶数先 F_i 后 F_{i+1}，奇数先 F_{i+1} 后 F_i（即总是先取较小编号者）。',
    en: 'Dijkstra\'s resource hierarchy: totally order forks by id and require acquiring the smaller id first. No "each holds one fork waiting for the other" cycle can form, eliminating deadlock. Philosopher P_i uses forks F_i and F_{(i+1)%n}; P_i acquires the smaller id first (even i: F_i then F_{i+1}; odd i: F_{i+1} then F_i).',
  },
  tags: ['concurrency', 'dining-philosophers', 'resource-hierarchy', 'deadlock-avoidance'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
