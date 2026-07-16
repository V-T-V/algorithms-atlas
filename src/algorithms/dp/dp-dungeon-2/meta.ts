import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-dungeon-2',
  categoryId: 'dp',
  title: { zh: '地下城游戏（逆向 DP）', en: 'Dungeon Game (Reverse DP)' },
  summary: {
    zh: '从右下到左上逆向 DP，求救出公主所需的最小初始血量。',
    en: 'Reverse DP from bottom-right to top-left; find minimum initial HP to rescue the princess.',
  },
  description: {
    zh: 'LeetCode 174。dp[i][j] 表示进入格子 (i,j) 之前所需的最小血量。dp[i][j]=max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])。终点 dp[m-1][n-1]=max(1, 1-dungeon)。',
    en: 'LC 174. dp[i][j] = min HP needed before entering cell. dp[i][j]=max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
  },
  tags: ['dp', 'grid', 'reverse', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
