import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-cheapest-flights',
  categoryId: 'graph',
  title: { zh: '便宜机票', en: 'Cheapest Flights Within K Stops' },
  summary: {
    zh: '在最多 k 次中转内从 src 到 dst 的最便宜机票。',
    en: 'Cheapest flight from src to dst using at most k stops (Bellman-Ford).',
  },
  description: {
    zh: 'LeetCode 787。n 个城市、有向带权边 flights[i]=(from,to,price)。从 src 出发到 dst，最多经过 k 个中转站（即最多 k+1 条边），求最低票价；不可达返回 -1。用 Bellman-Ford 限定轮数：松弛 k+1 轮，每轮用上一轮的 dist 副本更新（避免同轮内多次松弛多算边数）。时间 O((V+E)·k)，空间 O(V)。',
    en: 'LeetCode 787. n cities, directed priced edges; cheapest src→dst with ≤ k stops (≤ k+1 edges); -1 if unreachable. Bellman-Ford for k+1 rounds using a per-round snapshot to limit edge count. Time O((V+E)·k), space O(V).',
  },
  tags: ['bellman-ford', 'shortest-path', 'leetcode'],
  complexity: { time: 'O((V+E)·k)', space: 'O(V)' },
};
