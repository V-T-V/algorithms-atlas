import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-frog-3',
  categoryId: 'dp',
  title: { zh: '青蛙过河（含能量）', en: 'Frog Jump (Energy Cost)' },
  summary: {
    zh: '青蛙从一岸跳到对岸，每跳消耗能量，求最小总代价。',
    en: 'Frog crosses stones; each jump costs energy; find minimum total cost to the far bank.',
  },
  description: {
    zh: '青蛙过河变种（AtCoder Frog 2 风格）。n 块石头排成一行，h[i] 为高度，青蛙从石头 1 出发到石头 n，每次可跳 1~K 块石头，从 i 跳到 j 代价为 |h[i]-h[j]|。求最小总代价。DP：dp[i]=min over j∈[max(1,i-K),i-1] (dp[j]+|h[i]-h[j]|)。时间 O(nK)，空间 O(n)。',
    en: 'Frog jump variant (AtCoder DP B). dp[i]=min over j in [i-K,i-1] of dp[j]+|h[i]-h[j]|. Time O(nK), space O(n).',
  },
  tags: ['dp', 'frog', 'sequence', 'atcoder'],
  complexity: { time: 'O(nK)', space: 'O(n)' },
};
