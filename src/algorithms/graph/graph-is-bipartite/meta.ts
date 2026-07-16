import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-is-bipartite',
  categoryId: 'graph',
  title: { zh: '判定二分图', en: 'Is Graph Bipartite?' },
  summary: {
    zh: '染色法判断无向图能否二分（相邻异色）。',
    en: 'Two-color each component to test if the graph is bipartite.',
  },
  description: {
    zh: 'LeetCode 785。无向图 graph（邻接表），判断是否二分图：能否把节点分成两个集合，使每条边两端分属不同集合。对每个连通分量做 BFS/DFS 染色：起点染 0，邻居染 1，邻居的邻居染 0……若发现邻居已染色且与当前同色则非二分。时间 O(V+E)，空间 O(V)。',
    en: 'LeetCode 785. Given an undirected adjacency-list graph, decide if it is bipartite (partition into two sets with edges crossing). BFS two-coloring per component; a neighbor already colored the same as current means non-bipartite. Time O(V+E), space O(V).',
  },
  tags: ['bfs', 'coloring', 'bipartite', 'leetcode'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
