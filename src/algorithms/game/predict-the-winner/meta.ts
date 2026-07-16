// 预测赢家（Predict the Winner, LeetCode 486）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'predict-the-winner',
  categoryId: 'game',
  title: { zh: '预测赢家', en: 'Predict the Winner' },
  summary: {
    zh: '两人轮流从数组两端取数，先手分数能否 >= 后手（区间 DP）。',
    en: 'Players take numbers from either end; can player 1 tie or win (interval DP)?',
  },
  description: {
    zh: '给定一个非负整数数组 nums，两名玩家轮流从数组两端取一个数（每次只能取最左或最右），取到的数累加到自己的分数。两人都采用最优策略。先手（玩家 1）先取。判断玩家 1 能否成为赢家（分数 >= 玩家 2 返回 true）。\n\n区间 DP：dp[i][j] = 当前玩家面对 nums[i..j] 时能比对手多的分数。转移 dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])。最终 dp[0][n-1] >= 0 则玩家 1 不输。与石子游戏 877 同构，但 877 保证偶数堆必胜，本题需实际计算。',
    en: 'Given a non-negative array nums, two players alternate taking a number from either end (leftmost or rightmost), adding it to their score. Both play optimally. Player 1 moves first. Determine whether player 1 can win (score >= player 2 returns true).\n\nInterval DP: dp[i][j] = the score advantage the current player can build over the opponent on nums[i..j]. Transition dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1]). Player 1 wins or ties iff dp[0][n-1] >= 0. Structurally identical to Stone Game 877, but here the even-piles-always-win guarantee does not hold, so we must actually compute.',
  },
  tags: ['game', 'dp', 'interval-dp', 'minimax'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  references: [{ label: 'LeetCode 486', url: 'https://leetcode.com/problems/predict-the-winner/' }],
  defaultInput: [1, 5, 2],
};
