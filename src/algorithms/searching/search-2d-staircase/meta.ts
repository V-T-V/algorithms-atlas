// 二维矩阵查找（阶梯法） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-2d-staircase',
  categoryId: 'searching',
  title: { zh: '二维矩阵查找（阶梯法）', en: '2D Matrix Search (Staircase)' },
  summary: {
    zh: '从右上角起，每次比较后向左或向下走，O(m+n)。',
    en: 'Start at the top-right; on each comparison move left or down; O(m+n).',
  },
  description: {
    zh: '二维矩阵查找（阶梯法 / 走廊法）：矩阵每行从左到右升序、每列从上到下升序。从右上角 (r=0, c=n-1) 起，若 arr[r][c] == target 命中；arr[r][c] > target 则向左 c--（排除整列）；arr[r][c] < target 则向下 r++（排除整行）。每步排除一行或一列，共 O(m+n) 步。空间 O(1)。',
    en: '2D matrix staircase search: each row is ascending left to right and each column top to bottom. Start at the top-right (r=0, c=n-1); if arr[r][c] == target hit; arr[r][c] > target move left c-- (eliminate a column); arr[r][c] < target move down r++ (eliminate a row). Each step removes a row or column, O(m+n) total. Space O(1).',
  },
  tags: ['searching', '2d-matrix', 'staircase', 'sorted'],
  complexity: { time: 'O(m+n)', space: 'O(1)' },
};
