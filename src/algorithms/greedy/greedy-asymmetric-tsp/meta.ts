// 最近邻 TSP（Nearest Neighbor TSP）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-asymmetric-tsp',
  categoryId: 'greedy',
  title: { zh: '最近邻 TSP', en: 'Nearest Neighbor TSP' },
  summary: {
    zh: '从起点反复访问最近未访问城市，贪心构造 TSP 近似回路。',
    en: 'From a start city repeatedly visit the nearest unvisited city for a TSP approximation.',
  },
  description: {
    zh: '最近邻 TSP：从城市 0 出发，每次走到距离最近的未访问城市，最后回到起点。近似比 O(log n)，简单快速。',
    en: 'Nearest-neighbor TSP: start at city 0, repeatedly go to nearest unvisited, return to start. Ratio O(log n), simple and fast.',
  },
  tags: ['greedy', 'tsp', 'approximation'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
