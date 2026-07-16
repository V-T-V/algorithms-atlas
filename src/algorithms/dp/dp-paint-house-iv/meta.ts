import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-paint-house-iv',
  categoryId: 'dp',
  title: { zh: '粉刷房屋（k 色）', en: 'Paint House (k Colors)' },
  summary: {
    zh: 'n 栋房子、k 种颜色，相邻不同色，求最小粉刷成本。',
    en: 'Paint n houses with k colors, adjacent houses different color; minimize total cost.',
  },
  description: {
    zh: 'LeetCode 265。n 栋房子排成一行，cost[i][j] 表示第 i 栋刷成颜色 j 的成本，相邻房子颜色不同。求最小总成本。DP：dp[i][j]=cost[i][j]+min(dp[i-1][c] for c≠j)。朴素 O(nk²) 太慢；优化：维护上一行的最小值与次小值及最小值颜色，转移时若 j≠最小色则加最小，否则加次小，整体 O(nk)。本实现采用最小次小优化。时间 O(nk)，空间 O(k)。',
    en: 'LeetCode 265. DP dp[i][j]=cost[i][j]+min(dp[i-1][c],c!=j). Optimize by tracking min/second-min of previous row. Time O(nk), space O(k).',
  },
  tags: ['dp', 'greedy', 'leetcode'],
  complexity: { time: 'O(nk)', space: 'O(k)' },
};
