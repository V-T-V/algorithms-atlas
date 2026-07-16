import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-dijkstra-bidir',
  categoryId: 'graph',
  title: { zh: '双向 Dijkstra', en: 'Bidirectional Dijkstra' },
  summary: {
    zh: '从源与汇同时 Dijkstra，相遇即停，加速单源单汇最短路。',
    en: 'Run Dijkstra from both source and target; stop on meeting to speed up single-pair shortest path.',
  },
  description: {
    zh: '双向 Dijkstra。加权图上从 source 正向、从 target 反向同时跑 Dijkstra，每次扩展当前最小距离更小的一侧。维护 mu=已观察到的最短相遇距离；当某侧未定居最小距离 ≥ mu/2 或两侧已共同覆盖时停止。相比单向 Dijkstra，搜索半径减半，实践快约 2 倍。时间 O((E+V) log V)，空间 O(V)。',
    en: 'Bidirectional Dijkstra on weighted graph. Alternate expanding the smaller-min-dist side; stop when both frontiers exceed best meeting distance. Time O((E+V) log V), space O(V).',
  },
  tags: ['graph', 'shortest-path', 'dijkstra', 'bidirectional'],
  complexity: { time: 'O((E+V) log V)', space: 'O(V)' },
};
