import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-network-delay',
  categoryId: 'graph',
  title: { zh: '网络延迟时间', en: 'Network Delay Time' },
  summary: {
    zh: '信号从源点发出，求所有节点收到信号的时间（最大单源最短路）。',
    en: 'A signal spreads from a source; find the time until all nodes receive it (max SSSP).',
  },
  description: {
    zh: 'LeetCode 743。n 个节点、有向带权边 times[i]=(u,v,w)，信号从节点 k 发出，传播时间即边权。求所有节点都收到信号所需的最短时间；若有节点不可达返回 -1。即从 k 的单源最短路，答案 = dist 的最大值（∞ 则 -1）。用 Dijkstra（非负权）线性扫描版。时间 O(V²)，空间 O(V+E)。',
    en: 'LeetCode 743. n nodes, directed weighted edges times[i]=(u,v,w); signal from k spreads along edges. Time for all to receive = max single-source shortest path; -1 if some unreachable. Dijkstra (non-negative). Time O(V²), space O(V+E).',
  },
  tags: ['dijkstra', 'shortest-path', 'leetcode'],
  complexity: { time: 'O(V²)', space: 'O(V+E)' },
};
