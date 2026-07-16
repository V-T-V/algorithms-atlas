import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-snake-ladder',
  categoryId: 'graph',
  title: { zh: '蛇梯棋', en: 'Snakes and Ladders' },
  summary: {
    zh: 'BFS 求 n×n 蛇梯棋盘从 1 到 n² 的最少掷骰次数。',
    en: 'BFS for fewest dice rolls from 1 to n² on an n×n snakes-and-ladders board.',
  },
  description: {
    zh: 'LeetCode 909。n×n 棋盘，方格按 Boustrophedon 顺序编号（左下 1，蛇形上行）。某些方格有梯子/蛇：落到该格直接传送到 board[r][c] 指定编号（-1 表示无）。每回合掷骰子 1~6，求从 1 到 n² 的最少回合数。BFS：每步从当前格尝试掷出 1~6，若终点有梯/蛇则跳转，去重后入队。时间 O(n²)，空间 O(n²)。',
    en: 'LeetCode 909. BFS on n×n board with Boustrophedon numbering; each move rolls 1-6, follow ladder/snake. Time O(n²), space O(n²).',
  },
  tags: ['graph', 'bfs', 'board-game', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
