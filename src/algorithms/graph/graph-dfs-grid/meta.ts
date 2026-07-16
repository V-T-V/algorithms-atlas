import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-dfs-grid',
  categoryId: 'graph',
  title: { zh: '网格 DFS（岛屿计数）', en: 'Grid DFS (Islands Count)' },
  summary: {
    zh: '深度优先遍历网格，对连通的 1 染色，求岛屿数。',
    en: 'Depth-first traversal colors connected 1-cells; count distinct islands.',
  },
  description: {
    zh: '给定 m×n 二维网格 grid（"1" 为陆地，"0" 为水），岛屿是被水包围、由水平/垂直相邻的 "1" 连成的最大连通块。用 DFS 从每个未访问的 "1" 出发，递归（或栈）把整片连通陆地标记访问，计数即岛屿数。时间 O(mn)，空间 O(mn)（递归栈最坏）。',
    en: 'On an m×n grid ("1" land, "0" water), an island is a 4-connected component of "1"s. DFS from each unvisited "1" floods its whole component; the count of such seeds is the number of islands. Time O(mn), space O(mn).',
  },
  tags: ['dfs', 'grid', 'flood-fill'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
