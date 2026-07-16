import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-dungeon-game',
  categoryId: 'dp',
  title: { zh: '地下城游戏', en: 'Dungeon Game' },
  summary: {
    zh: '骑士从左上到右下救公主，每格加血或扣血，血量须恒 >0，求最少初始血量。',
    en: 'Knight rescues princess; each cell adds/removes HP (must stay >0); find min initial HP.',
  },
  description: {
    zh: 'LeetCode 174。网格 dungeon[i][j]：负数表示伤害，正数表示补给。骑士从 (0,0) 到 (m-1,n-1)，只能向右或向下，任意时刻血量须 >0。求最少初始血量。反向 DP：need[i][j]=从 (i,j) 到终点所需的最小进入血量。need[i][j]=max(1, min(need[i+1][j], need[i][j+1]) - dungeon[i][j])。边界 need[m-1][n-1]=max(1, 1-dungeon[m-1][n-1])。时间 O(mn)，空间 O(n)（滚动）。',
    en: 'LeetCode 174. Reverse DP: need[i][j]=max(1, min(need[down],need[right]) - dungeon[i][j]). Time O(mn), space O(n) rolling.',
  },
  tags: ['dp', 'grid', 'game', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(n)' },
};
