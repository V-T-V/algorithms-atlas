import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-frog-2',
  categoryId: 'dp',
  title: { zh: '青蛙跳 2（跳 1~K 步）', en: 'Frog 2 (Jump up to K)' },
  summary: {
    zh: '青蛙每次可跳 1~K 步，代价为高度差绝对值，求到终点的最小代价。',
    en: 'A frog may jump 1..K stones; cost is the absolute height difference; minimize total.',
  },
  description: {
    zh: 'AtCoder DP Contest B。一排石头高度 h[i]，青蛙从第 0 块出发，每次可向前跳 1 到 K 步，落在第 j 块的代价为 |h[i]-h[j]|，求到达第 n-1 块的最小总代价。状态 dp[i] = 到达第 i 块的最小代价，转移 dp[i] = min(dp[i-k] + |h[i-k]-h[i]|) 对 k=1..K。时间 O(nK)，空间 O(n)。',
    en: 'AtCoder DP Contest B. Stones have heights h[i]; the frog starts at 0 and may jump 1..K steps forward, paying |h[i]-h[j]| to land on j; reach stone n-1 with min cost. dp[i]=min(dp[i-k]+|h[i-k]-h[i]|) for k=1..K. Time O(nK), space O(n).',
  },
  tags: ['dp', 'linear', 'atcoder'],
  complexity: { time: 'O(nK)', space: 'O(n)' },
};
