import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-min-cost-climbing',
  categoryId: 'dp',
  title: { zh: '最小代价爬楼梯', en: 'Min Cost Climbing Stairs' },
  summary: {
    zh: '每阶有代价，可爬 1 或 2 阶，求到顶的最小累计代价。',
    en: 'Each step has a cost; climb 1 or 2 steps; minimize total cost to reach the top.',
  },
  description: {
    zh: '给定非负数组 cost，cost[i] 表示离开第 i 个台阶时需付出的代价。你可以从下标 0 或 1 起步，每次爬 1 或 2 阶，目标是跨过最后一个台阶到达顶层。状态 dp[i] = 到达第 i 阶（并已付其代价）的最小累计，转移 dp[i] = min(dp[i-1], dp[i-2]) + cost[i]，答案 = min(dp[n-1], dp[n-2])（最后一步不付额外代价）。时间 O(n)。',
    en: 'Given a non-negative cost array where cost[i] is paid when leaving step i, you may start at index 0 or 1 and climb 1 or 2 steps each time, aiming to pass the last step. State dp[i] = min total to reach and pay step i, transition dp[i] = min(dp[i-1], dp[i-2]) + cost[i], answer = min(dp[n-1], dp[n-2]). Time O(n).',
  },
  tags: ['dp', 'linear', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
