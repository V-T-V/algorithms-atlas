// 注水问题（Water Filling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-water-tap',
  categoryId: 'greedy',
  title: { zh: '注水问题', en: 'Water Filling' },
  summary: {
    zh: '把有限水分配到不同容量容器使最小水位最大，贪心按容量递增。',
    en: 'Allocate limited water to containers to maximize the minimum water level; fill smallest first.',
  },
  description: {
    zh: '注水：n 个容器容量 c_i，总水量 W。最大化最小水位：先填最小的，超容则均摊，等价于凸资源分配。',
    en: 'Water filling: n containers capacity c_i, total W. Maximize min level: fill smallest first, equalize beyond, a convex allocation.',
  },
  tags: ['greedy', 'resource-allocation', 'convex'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
