// Super Egg Drop · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-super-egg-drop',
  categoryId: 'dp',
  title: { zh: '鸡蛋掉落·二分优化', en: 'Super Egg Drop (Binary Search)' },
  summary: {
    zh: 'K 个鸡蛋 N 层楼，二分优化 DP 求最少试探次数。',
    en: 'K eggs, N floors: binary-search optimized DP for minimum trials.',
  },
  description: {
    zh: '经典鸡蛋掉落：K 个鸡蛋、N 层楼，求最坏情况下确定临界层的最少扔鸡蛋次数。朴素 DP dp[k][n]=1+min(max(dp[k-1][i-1], dp[k][n-i])) 为 O(KN²)。用决策单调性（dp[k-1][i-1] 递增、dp[k][n-i] 递减）对 i 二分，降到 O(KN log N)。本实现即二分优化版。',
    en: 'Classic egg drop: K eggs, N floors, find the minimum number of throws to determine the critical floor in the worst case. Naive DP dp[k][n]=1+min(max(dp[k-1][i-1], dp[k][n-i])) is O(KN²). Using decision monotonicity (dp[k-1][i-1] increasing, dp[k][n-i] decreasing), binary search on i reduces to O(KN log N). This is the binary-search optimized version.',
  },
  tags: ['dp', 'egg-drop', 'binary-search', 'decision-monotonic'],
  complexity: { time: 'O(KN log N)', space: 'O(KN)' },
};
