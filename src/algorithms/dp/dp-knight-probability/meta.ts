import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-knight-probability',
  categoryId: 'dp',
  title: { zh: '骑士留在棋盘概率', en: 'Knight Probability in Chessboard' },
  summary: {
    zh: '骑士按 8 个日字方向随机走 k 步，求仍留在棋盘的概率。',
    en: 'A knight makes k random L-shaped moves; find the probability it stays on the board.',
  },
  description: {
    zh: '在 n×n 的国际象棋棋盘上，骑士从 (r,c) 出发，每步等概率地选择 8 个「日」字方向之一。一旦走出棋盘便不再返回。求走完 k 步后骑士仍留在棋盘上的概率。状态 dp[i][j] 表示当前步数下骑士位于 (i,j) 的概率；每步把每个位置的概率均分到 8 个方向，留在棋盘的部分进入下一层。最终留在棋盘的概率为所有位置概率之和。时间 O(k·n²)。',
    en: "On an n-by-n chessboard a knight at (r,c) picks one of 8 L-shaped moves uniformly each step; once it leaves the board it never returns. Find the probability it remains on the board after k moves. State dp[i][j] = probability the knight is at (i,j) at the current step; each step splits each cell's probability into 8 directions, with on-board portions carrying forward. The answer is the sum over all cells. Time O(k·n²).",
  },
  tags: ['dp', 'probability', 'grid', 'chess', 'leetcode'],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
