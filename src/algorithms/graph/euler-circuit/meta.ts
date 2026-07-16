import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-circuit',
  categoryId: 'graph',
  title: { zh: '欧拉回路', en: 'Eulerian Circuit' },
  summary: {
    zh: 'Hierholzer 算法求经过每条边恰好一次的闭合回路。',
    en: 'Hierholzer finds a closed trail using every edge exactly once.',
  },
  description: {
    zh: '欧拉回路是经过图中每条边恰好一次并回到起点的闭合路径。无向图存在欧拉回路当且仅当连通且所有顶点度数为偶数；有向图当且仅当弱连通且每点入度等于出度。Hierholzer 算法从一个度数>0 的顶点出发，沿未使用边游走，走到死胡同则回退并入栈，最终栈逆序即为欧拉回路。时间 O(V+E)。',
    en: 'An Eulerian circuit traverses every edge exactly once and returns to the start. An undirected graph has one iff it is connected and all vertices have even degree; a directed graph iff weakly connected with in-degree = out-degree at every vertex. Hierholzer walks unused edges, backtracks at dead ends, and the reversed stack gives the circuit. Time O(V+E).',
  },
  tags: ['graph', 'euler', 'circuit', 'hierholzer', 'traversal'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
