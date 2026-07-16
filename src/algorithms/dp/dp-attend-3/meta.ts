import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-attend-3',
  categoryId: 'dp',
  title: { zh: '参加最多活动（按结束时间 dp）', en: 'Attend Meetings (End-time DP)' },
  summary: {
    zh: '给定若干区间 [start,end)，求不重叠地参加最多活动数。',
    en: 'Given intervals, attend max number of non-overlapping meetings.',
  },
  description: {
    zh: '按结束时间排序。dp[i]=前 i 个区间中可选的最大数。若 i 与 dp 前驱不重叠则 dp[i]=dp[p(i)]+1。',
    en: 'Sort by end. dp[i]=max count using first i. If i non-overlaps predecessor, dp[i]=dp[p]+1.',
  },
  tags: ['dp', 'interval-scheduling', 'greedy'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
