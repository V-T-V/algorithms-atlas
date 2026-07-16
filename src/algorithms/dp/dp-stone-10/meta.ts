import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stone-10',
  categoryId: 'dp',
  title: { zh: '合并石子（K=2，区间dp）', en: 'Merge Stones (K=2 Interval DP)' },
  summary: {
    zh: 'n 堆石子，每次合并相邻两堆代价为两堆之和，求最小总代价。',
    en: 'Merge adjacent piles (cost = sum of two piles); minimize total cost.',
  },
  description: {
    zh: '经典区间 dp：dp[i][j]=合并 i..j 的最小代价。dp[i][j]=min(dp[i][k]+dp[k+1][j])+sum(i..j)，用前缀和。',
    en: 'Interval dp: dp[i][j]=min over k of dp[i][k]+dp[k+1][j]+sum(i..j).',
  },
  tags: ['dp', 'interval-dp', 'stone-merge'],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
};
