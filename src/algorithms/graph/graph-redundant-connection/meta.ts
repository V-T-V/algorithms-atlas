import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-redundant-connection',
  categoryId: 'graph',
  title: { zh: '冗余连接', en: 'Redundant Connection' },
  summary: {
    zh: '无向图多了一条边成环，找出最后一条构成环的边。',
    en: 'In an undirected graph with one extra edge forming a cycle, find that redundant edge.',
  },
  description: {
    zh: 'LeetCode 684。给定无向边列表 edges，原本是一棵树多了一条边（共 n 条边、n 个节点）。返回能被删除使图仍连通成树的那条边；若多解，返回输入中最后出现的那条。用并查集逐边 union：当某条边的两端点已经同根时，该边即为冗余边。时间 O(E·α)，空间 O(V)。',
    en: 'LeetCode 684. Given undirected edges forming a tree plus one extra edge, return the redundant edge (the last one in input that, removed, keeps it a tree). Union-Find: as edges are unioned, the first whose endpoints already share a root is the redundant edge. Time O(E·α), space O(V).',
  },
  tags: ['union-find', 'graph', 'leetcode'],
  complexity: { time: 'O(E·α(V))', space: 'O(V)' },
};
