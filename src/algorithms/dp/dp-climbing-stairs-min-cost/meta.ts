import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-climbing-stairs-min-cost',
  categoryId: 'dp',
  title: { zh: '爬楼梯最小代价（滚动）', en: 'Min Cost Climbing Stairs (Rolling)' },
  summary: {
    zh: '可爬 1 或 2 阶，每阶有代价，求到顶最小累计（O(1) 空间滚动数组版本）。',
    en: 'Climb 1 or 2 steps each with a cost; reach the top with min total (O(1) space rolling DP).',
  },
  description: {
    zh: '与 dp-min-cost-climbing 同一问题（LeetCode 746），但这里强调用 O(1) 空间的滚动数组实现。约定：起步不付费，离开第 i 阶时付 cost[i]。dp[i] = 到达第 i 阶（已付）的最小累计；用两个变量 a=dp[i-2], b=dp[i-1] 滚动推进，dp[i]=min(a,b)+cost[i]，答案=min(dp[n-1],dp[n-2])。时间 O(n)，空间 O(1)。',
    en: 'Same problem as dp-min-cost-climbing (LeetCode 746), but using an O(1) rolling-variable implementation. dp[i] = min(dp[i-1],dp[i-2])+cost[i]; answer=min(dp[n-1],dp[n-2]). Time O(n), space O(1).',
  },
  tags: ['dp', 'rolling-array', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
