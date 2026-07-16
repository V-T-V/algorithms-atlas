// Frog Jump Hard · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-frog-hard',
  categoryId: 'dp',
  title: { zh: '青蛙跳·困难版', en: 'Frog Jump (Hard)' },
  summary: {
    zh: '青蛙最多跳 cost 步远，求到达终点的最小代价。',
    en: 'Frog can jump up to cost steps at a time; find min cost to reach the end.',
  },
  description: {
    zh: '困难版青蛙跳：第 i 块石头有费用 h[i]，青蛙每次最多跳跃 maxJump 步（不是固定的 1 或 2），求从第 0 块到达第 n-1 块的最小累计费用。dp[i] = min(dp[j] + h[i]) for j in [i-maxJump, i-1]。朴素 O(N·maxJump)，可用单调队列优化到 O(N)。本实现给朴素 DP（清晰展示状态转移）。',
    en: 'Hard frog jump: stone i has cost h[i]; the frog can jump up to maxJump stones per move (not just 1 or 2). Find min total cost from stone 0 to stone n-1. dp[i] = min(dp[j] + h[i]) for j in [i-maxJump, i-1]. Naive O(N·maxJump), optimizable to O(N) with a monotone queue. We give the naive DP for clarity.',
  },
  tags: ['dp', 'frog', 'jump', 'sliding-window'],
  complexity: { time: 'O(N·K)', space: 'O(N)' },
};
