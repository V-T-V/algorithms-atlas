import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stone-9',
  categoryId: 'dp',
  title: { zh: '石子合并（区间 DP + 前缀和）', en: 'Merge Stones (Interval DP + Prefix Sum)' },
  summary: {
    zh: '一排石子每次合并相邻两堆代价为二者之和，求最小总代价。',
    en: 'Merge adjacent piles; cost is sum of two piles; minimize total cost via interval DP.',
  },
  description: {
    zh: 'dp[i][j] = 合并区间 [i,j] 的最小代价；dp[i][j]=min(dp[i][k]+dp[k+1][j]) + sum(i,j)。用前缀和 O(1) 取区间和。时间 O(n³)。',
    en: 'dp[i][j] = min cost to merge [i,j]; transition over split k; prefix sums for range sum in O(1). Time O(n³).',
  },
  tags: ['dp', 'interval-dp', 'prefix-sum'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
