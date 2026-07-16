import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-min-height-trees',
  categoryId: 'graph',
  title: { zh: '最小高度树', en: 'Minimum Height Trees' },
  summary: {
    zh: '在无向树中选根使树高最小（拓扑剥叶法）。',
    en: 'Pick tree roots that minimize the tree height (peeling leaves).',
  },
  description: {
    zh: 'LeetCode 310。给定无向树的 n 个节点和边，以某节点为根时树高最小。求所有使高度最小的根节点。算法：反复剥掉叶子（度=1），直到剩下 ≤2 个节点，它们即答案（图的「中心」）。类似拓扑排序但按度数。时间 O(V)，空间 O(V)。',
    en: 'LeetCode 310. On an undirected tree, find all roots minimizing the height. Peel leaves (degree 1) layer by layer until ≤2 nodes remain; they are the centers. Time O(V), space O(V).',
  },
  tags: ['topological-sort', 'tree', 'leetcode'],
  complexity: { time: 'O(V)', space: 'O(V)' },
};
