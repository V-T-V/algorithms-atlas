import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-frog',
  categoryId: 'dp',
  title: { zh: '青蛙跳石头', en: 'Frog Jump Stones' },
  summary: {
    zh: '青蛙每次跳 1 或 2 块石头，求到终点的最小累计代价。',
    en: 'A frog jumps 1 or 2 stones at a time; minimize total cost to the last stone.',
  },
  description: {
    zh: '一排石头，第 i 块有代价 cost[i]（青蛙踩上去就要付出）。青蛙从第 0 块出发，每次只能向前跳 1 或 2 块，必须到达第 n-1 块。求最小总代价。状态 dp[i] = 到达第 i 块的最小累计代价，转移 dp[i] = min(dp[i-1], dp[i-2]) + cost[i]，初值 dp[0]=cost[0]、dp[1]=cost[1]。回溯得到跳跃路径。时间 O(n)。',
    en: 'A row of stones each with cost[i] paid when stepped on. The frog starts at stone 0 and must reach stone n-1, jumping 1 or 2 stones forward each move. State dp[i] = min total cost to reach stone i, transition dp[i] = min(dp[i-1], dp[i-2]) + cost[i]. Backtracking recovers the jump path. Time O(n).',
  },
  tags: ['dp', 'linear', 'path-reconstruction'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
