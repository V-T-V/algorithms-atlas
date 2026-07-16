import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-longest-increasing-path',
  categoryId: 'dp',
  title: { zh: '矩阵最长递增路径', en: 'Longest Increasing Path' },
  summary: {
    zh: '记忆化 DFS：每步走向数值更大的相邻格，求最长路径。',
    en: 'Memoized DFS: move to larger-value neighbors; find the longest path.',
  },
  description: {
    zh: '给定 m×n 整数矩阵，从任一格出发，每步可走向上下左右相邻且数值严格更大的格子，求可走的最长路径长度。因为只能向更大值走，状态依赖关系是 DAG，可用记忆化搜索：memo[i][j] = 从 (i,j) 出发的最长路径长度，递归为 1 + max{ memo[更大邻居] }。每个格子只算一次。时间 O(mn)。',
    en: 'Given an m-by-n integer matrix, starting from any cell you may move to an orthogonally adjacent cell with a strictly larger value; find the longest such path. Since moves always go to larger values, the dependency graph is a DAG, enabling memoized DFS: memo[i][j] = 1 + max{ memo[larger neighbors] }, with each cell computed once. Time O(mn).',
  },
  tags: ['dp', 'memoization', 'dfs', 'matrix', 'dag', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
