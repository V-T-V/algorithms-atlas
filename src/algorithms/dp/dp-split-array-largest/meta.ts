import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-split-array-largest',
  categoryId: 'dp',
  title: { zh: '分割数组的最大值', en: 'Split Array Largest Sum' },
  summary: {
    zh: '将数组分成 m 段连续子数组，使最大段和最小。',
    en: 'Split array into m contiguous subarrays minimizing the largest subarray sum.',
  },
  description: {
    zh: 'LeetCode 410。给定非负数组 nums 与段数 m，将 nums 分成 m 段连续非空子数组，使各段和的最大值最小。两种主流解法：(1) DP：dp[i][j]=前 i 个数分 j 段的最优值，转移 dp[i][j]=min over k (max(dp[k][j-1], sum(k+1..i)))，O(n²m)；(2) 二分答案：在 [max,sun] 上二分猜测上限 limit，贪心检查能否分成 ≤m 段。本实现用二分答案。时间 O(n·log(sum))，空间 O(1)。',
    en: 'LeetCode 410. Binary search the answer over [max,sum]; greedily check feasibility of <=m segments per candidate limit. Time O(n·log(sum)), space O(1).',
  },
  tags: ['dp', 'binary-search', 'greedy', 'leetcode'],
  complexity: { time: 'O(n·log(sum))', space: 'O(1)' },
};
