// 太平洋大西洋水流（DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-pacific-atlantic',
  categoryId: 'recursion',
  title: { zh: '太平洋大西洋水流（DFS）', en: 'Pacific Atlantic Water Flow (DFS)' },
  summary: {
    zh: '从两片海域反向 DFS：水只能从高流向低，找能同时流向两海的位置。',
    en: 'Reverse DFS from both oceans: water flows high-to-low; find cells that can reach both oceans.',
  },
  description: {
    zh: '给定 m×n 非负整数矩阵 heights 表示地形高度。左上边界接太平洋，右下边界接大西洋。水可从一格流向其四邻中高度「小于等于」的格子。求所有能同时流到太平洋和大西洋的格子坐标。解法：从太平洋边界（第 0 行、第 0 列）反向 DFS 标记可达 paci，从大西洋边界（末行、末列）反向 DFS 标记可达 atlan（反向时只能从低向高走，等价于正向从高向低）。两者的交集即为答案。',
    en: 'Given an m x n non-negative integer matrix heights representing terrain, the top and left borders touch the Pacific and the bottom and right borders touch the Atlantic. Water flows from a cell to a neighbor of height less than or equal. Find all cells that can reach both oceans. Solution: reverse-DFS from the Pacific border (row 0, col 0) marking reachable paci, and from the Atlantic border (last row, last col) marking reachable atlan (reverse DFS only goes low-to-high, equivalent to forward high-to-low). The intersection of the two is the answer.',
  },
  tags: ['recursion', 'dfs', 'grid', 'reachability', 'water-flow'],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
