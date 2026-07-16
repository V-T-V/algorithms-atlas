// 最短增广路 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-shortest-augmenting',
  categoryId: 'network',
  title: { zh: '最短增广路算法', en: 'Shortest Augmenting Path Algorithm' },
  summary: {
    zh: '每轮用 BFS 找一条最短（边数最少）的 s-t 增广路，等价于 Edmonds-Karp。',
    en: 'Each round use BFS to find a shortest (fewest-hop) s-t augmenting path; equivalent to Edmonds-Karp.',
  },
  description: {
    zh: '最短增广路算法：在残量图上每次选边数最少的增广路（BFS）。这一选择保证增广次数为 O(V·E)，从而总复杂度 O(V·E²)，与最大容量选择无关。它是 Edmonds-Karp 的本质，也保证增广路长度单调不降。',
    en: 'Shortest augmenting path algorithm: each round pick the augmenting path with the fewest edges (BFS). This guarantees O(V·E) augmentations and thus O(V·E²) total, independent of capacities. It is the essence of Edmonds-Karp and ensures augmenting path lengths are monotonically non-decreasing.',
  },
  tags: ['network', 'max-flow', 'augmenting-path', 'bfs', 'edmonds-karp'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};
