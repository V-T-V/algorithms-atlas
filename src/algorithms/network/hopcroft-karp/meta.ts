// Hopcroft-Karp 二分图最大匹配 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hopcroft-karp',
  categoryId: 'network',
  title: { zh: 'Hopcroft-Karp 二分图匹配', en: 'Hopcroft-Karp Bipartite Matching' },
  summary: {
    zh: '每轮 BFS 找多条最短增广路并行增广，O(E·√V)。',
    en: 'Each round BFS finds many shortest augmenting paths at once; O(E·√V).',
  },
  description: {
    zh: "Hopcroft-Karp 算法求二分图最大匹配：\n\n1. **BFS 分层**：从所有未匹配的左侧点出发，沿「未匹配边 → 匹配边」交替前进，给右侧点打层数，到达的最短增广路长度记为 dist。\n2. **DFS 并行增广**：从每个未匹配左侧点做 DFS，只走 `dist[r] + 1 = dist[r']` 的边，找一组互不相交的最短增广路同时翻转。\n3. 重复直到 BFS 找不到增广路（无法到达未匹配右侧点）。\n\n每轮最短增广路长度严格递增，至多 `O(√V)` 轮，每轮 `O(E)`，总 `O(E·√V)`。",
    en: "Hopcroft-Karp finds a maximum bipartite matching:\n\n1. **BFS layering**: from all free left vertices, alternate along unmatched/matched edges, level the right side; the shortest augmenting path length is `dist`.\n2. **DFS augment in parallel**: from each free left vertex run DFS restricted to edges with `dist[r] + 1 = dist[r']`, flipping a vertex-disjoint set of shortest augmenting paths.\n3. Repeat until BFS finds no augmenting path.\n\nEach round strictly increases the shortest augmenting path length, bounding rounds to `O(√V)`; each round is `O(E)`, total `O(E·√V)`.",
  },
  tags: ['network', 'matching', 'bipartite', 'bfs', 'dfs'],
  complexity: { time: 'O(E·√V)', space: 'O(V + E)' },
};
