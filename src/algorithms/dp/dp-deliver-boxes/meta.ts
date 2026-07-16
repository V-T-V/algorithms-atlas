import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-deliver-boxes',
  categoryId: 'dp',
  title: { zh: '运送盒子', en: 'Deliver Boxes' },
  summary: {
    zh: '顺序运送最多 maxBoxes 个同色段不超过 maxPorts 的盒子，求最少行程。',
    en: 'Deliver up to maxBoxes with limited port-segments per trip; minimize trips.',
  },
  description: {
    zh: 'LeetCode 1681 简化版。一列盒子，每个属于某港口 ports[i]。货车一次最多装 maxBoxes 个盒子，且这些盒子的不同港口数 ≤ maxPorts；每次往返算 2·(不同港口数) 次行程。盒子必须按顺序连续装。dp[i] = 送完前 i 个盒子的最小行程；dp[i]=min(dp[j] + cost(j,i)) 对满足约束的 j<i。这里简化为：每段费用 = 2·(段内不同港口数)。时间 O(n²)，空间 O(n)。',
    en: 'LeetCode 1681 simplified. Boxes belong to ports; each trip carries ≤ maxBoxes consecutive boxes with ≤ maxPorts distinct ports; trip cost = 2·distinct ports. dp[i]=min(dp[j]+cost(j,i)) over valid j. Time O(n²), space O(n).',
  },
  tags: ['dp', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
