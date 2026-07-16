import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-reachable-nodes',
  categoryId: 'graph',
  title: { zh: '可达节点', en: 'Reachable Nodes in Subdivided Graph' },
  summary: {
    zh: '每条边细分为若干子节点，给定步数限制求可达节点数。',
    en: 'Edges are subdivided into intermediate nodes; count nodes reachable within a budget.',
  },
  description: {
    zh: 'LeetCode 882。无向图每条边 (u,v) 被 contract[u][v] 个中间节点细分为 contract+1 段。从节点 0 出发，maxMoves 步内能到达多少节点（含原图节点和中间节点）。Dijkstra 求到每个原图节点的最短距离，若 ≤ maxMoves 则该节点可达；对每条边，两端剩余步数之和被边上的子节点数截断，计入可达的中间节点。时间 O(E log V)，空间 O(V+E)。',
    en: 'LeetCode 882. Each edge (u,v) is subdivided into contract intermediate nodes; from node 0 with maxMoves budget, count reachable nodes (original + intermediate). Dijkstra for distances; per edge, add min(contract, leftover_u + leftover_v). Time O(E log V), space O(V+E).',
  },
  tags: ['dijkstra', 'shortest-path', 'leetcode'],
  complexity: { time: 'O(E log V)', space: 'O(V+E)' },
};
