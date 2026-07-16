// 石子游戏（Stone Game, LeetCode 877）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stone-game-g',
  categoryId: 'game',
  title: { zh: '石子游戏（区间 DP）', en: 'Stone Game (Interval DP)' },
  summary: {
    zh: '偶数堆石子，轮流从两端取，求先手最大分差（区间 DP）。',
    en: "Even pile of stones, take from either end; find first player's max score gap.",
  },
  description: {
    zh: 'Alex 和 Lee 玩石子游戏：偶数堆石子排成一排，piles[i] 是第 i 堆的石头数，总数为奇数。两人轮流取，每次只能取最左或最右一堆；Alex 先手。求 Alex 是否能赢（分数严格更大）。\n\n数学结论：当堆数为偶数时 Alex 总能赢（先手可控制取走所有奇数位或偶数位的堆）。但更有教学意义的是用区间 DP 求最大分差：dp[i][j] = 当前玩家在 piles[i..j] 上能比对手多的分数；转移 dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])。本实现即用此 DP。',
    en: 'Alex and Lee play with an even number of piles in a row, total stones odd. They alternate taking the leftmost or rightmost pile; Alex first. Determine whether Alex can win (strictly more stones).\n\nMath result: with an even number of piles Alex always wins (he can choose to take all odd- or even-indexed piles). But the instructive approach is interval DP for the max score gap: dp[i][j] = the advantage the current player can build over the opponent on piles[i..j]; transition dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]). This implementation uses that DP.',
  },
  tags: ['game', 'dp', 'interval-dp', 'minimax'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  references: [{ label: 'LeetCode 877', url: 'https://leetcode.com/problems/stone-game/' }],
  defaultInput: [5, 3, 4, 5],
};
