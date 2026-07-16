import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-max-flow-3',
  categoryId: 'graph',
  title: { zh: '最大流（Edmonds-Karp）', en: 'Max Flow (Edmonds-Karp)' },
  summary: {
    zh: 'BFS 反复在残量图上找增广路径，求源点到汇点的最大流。',
    en: 'Repeatedly BFS for augmenting paths in the residual graph to maximize s-t flow.',
  },
  description: {
    zh: 'Edmonds-Karp：残量图中 BFS 找到 s→t 最短增广路径，沿路径压入瓶颈流量，更新正反向残量。直到没有增广路径。',
    en: 'BFS shortest augmenting path in residual graph; push bottleneck flow; update forward/backward residual. Repeat until no augmenting path.',
  },
  tags: ['graph', 'max-flow', 'edmonds-karp'],
  complexity: { time: 'O(V·E²)', space: 'O(V+E)' },
};
