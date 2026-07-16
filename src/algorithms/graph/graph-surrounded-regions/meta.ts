import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-surrounded-regions',
  categoryId: 'graph',
  title: { zh: '被围绕的区域', en: 'Surrounded Regions' },
  summary: {
    zh: '把被 X 完全包围的 O 区域翻转为 X，边界相连的 O 保留。',
    en: 'Flip O-regions fully surrounded by X to X; keep O-regions connected to the border.',
  },
  description: {
    zh: 'LeetCode 130。m×n 矩阵 board 含 "X" 和 "O"。把所有被 "X" 围绕（即水平/垂直方向不接触边界）的 "O" 区域翻转为 "X"，其余 "O" 保留。方法：先从四条边上的 "O" 出发做 DFS/BFS 标记为临时 "#"；再把剩下的 "O" 全部翻成 "X"（被围绕），最后把 "#" 还原为 "O"。时间 O(mn)，空间 O(mn)。',
    en: 'LeetCode 130. Flip O-regions fully surrounded by X (not touching the border) into X; keep border-connected O-regions. DFS/BFS from border O-cells marking them as #; flip remaining O to X; restore # to O. Time O(mn), space O(mn).',
  },
  tags: ['dfs', 'flood-fill', 'grid', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
