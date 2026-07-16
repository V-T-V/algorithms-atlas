import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-sliding-puzzle',
  categoryId: 'graph',
  title: { zh: '滑动谜题', en: 'Sliding Puzzle' },
  summary: {
    zh: '2×3 数字华容道，滑到目标 [[1,2,3],[4,5,0]] 求最少步数。',
    en: '2×3 sliding puzzle; reach [[1,2,3],[4,5,0]] with minimum moves.',
  },
  description: {
    zh: 'LeetCode 773。2×3 板 board，0 表示空格，可与其上下左右相邻数字交换。求到目标 [[1,2,3],[4,5,0]] 的最少交换次数；不可达返回 -1。BFS：以棋盘串为状态，从初始串扩展每次空格的 4 种交换，记录已访问；首次到目标即最短。时间 O(6!·4)，空间 O(6!)。',
    en: 'LeetCode 773. On a 2×3 board (0 = empty), swap 0 with an adjacent digit; find min moves to [[1,2,3],[4,5,0]] (-1 if unreachable). BFS over board-string states; first arrival is shortest. Time O(6!·4), space O(6!).',
  },
  tags: ['bfs', 'state-space', 'puzzle', 'leetcode'],
  complexity: { time: 'O(6!·4)', space: 'O(6!)' },
};
