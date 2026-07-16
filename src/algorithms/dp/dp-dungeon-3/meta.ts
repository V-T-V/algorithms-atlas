import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-dungeon-3',
  categoryId: 'dp',
  title: { zh: '地下城游戏（最小初始血量）', en: 'Dungeon Game (Min Initial HP)' },
  summary: {
    zh: '从左上到右下，每格增/减血，血须始终 >0，求最小初始血量。',
    en: 'Top-left to bottom-right, each cell +/- HP, HP must stay >0; find min initial HP.',
  },
  description: {
    zh: '反向 dp：dp[i][j] = 从该格到终点所需的最小血量。dp[i][j]=max(1, min(dp[i+1][j], dp[j+1])-dmg[i][j])。',
    en: 'Reverse dp[i][j]=min HP needed from cell to princess. dp=max(1, min(right,down)-dmg).',
  },
  tags: ['dp', 'grid', 'reverse-dp'],
  complexity: { time: 'O(m*n)', space: 'O(n)' },
};
