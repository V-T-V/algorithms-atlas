import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tallest-billboard',
  categoryId: 'dp',
  title: { zh: '最高广告牌', en: 'Tallest Billboard' },
  summary: {
    zh: '每根钢管放左、右或不放，使两支撑等高，求该最大高度。',
    en: 'Place each rod on the left support, right support, or skip; maximize the equal support height.',
  },
  description: {
    zh: 'LeetCode 956。给定 rods 数组，每根钢管可以装在广告牌的左支撑、右支撑，或不使用。两支撑高度必须相等，求能搭出的最大相等高度（不能则 0）。DP on 高度差：dp[diff] = 在高度差为 diff 下较高一侧的最大高度。对每根 rod r：左 dp[diff+r]=max(…, dp[diff]+r)；右 dp[diff-r]=max(…, dp[diff])；不放。答案 = dp[0]。时间 O(n·sum)，空间 O(sum)。',
    en: 'LeetCode 956. Each rod may go on the left support, right support, or be unused; supports must be equal height; maximize it. DP on height diff: dp[diff] = max taller-side height under that diff. Per rod r: left dp[diff+r]=max(…,dp[diff]+r); right dp[diff-r]=max(…,dp[diff]); skip. Answer = dp[0]. Time O(n·sum), space O(sum).',
  },
  tags: ['dp', 'knapsack', 'leetcode'],
  complexity: { time: 'O(n·sum)', space: 'O(sum)' },
};
