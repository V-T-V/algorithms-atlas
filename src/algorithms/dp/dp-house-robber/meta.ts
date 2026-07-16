import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-house-robber',
  categoryId: 'dp',
  title: { zh: '打家劫舍', en: 'House Robber' },
  summary: {
    zh: '相邻房屋不可同时选，求最大收益（线性 DP）。',
    en: 'Maximize loot without choosing two adjacent houses (linear DP).',
  },
  description: {
    zh: '一排房屋，每间有金额 nums[i]，不能同时抢劫相邻两间。状态 dp[i] 表示考虑前 i+1 间屋时的最大收益，转移 dp[i] = max(dp[i-1]（不抢 i）, dp[i-2] + nums[i]（抢 i）)。答案 = dp[n-1]。回溯时若 dp[i] != dp[i-1] 则说明抢了第 i 间。时间 O(n)。',
    en: 'A row of houses each with money nums[i]; adjacent houses cannot both be robbed. State dp[i] = max loot considering the first i+1 houses, transition dp[i] = max(dp[i-1] (skip i), dp[i-2] + nums[i] (rob i)). Answer = dp[n-1]; backtrack to recover which houses were robbed. Time O(n).',
  },
  tags: ['dp', 'linear', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
