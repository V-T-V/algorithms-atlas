import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-min-sideway-jumps',
  categoryId: 'dp',
  title: { zh: '最少侧跳次数', en: 'Minimum Sideway Jumps' },
  summary: {
    zh: '3 道青蛙跳跃，避开障碍物，最少侧跳到达终点。',
    en: 'A frog on a 3-lane road dodges obstacles; minimize side jumps to finish.',
  },
  description: {
    zh: 'LeetCode 1824。3 条跑道（点 0..n），obstacles[i]∈{0,1,2,3} 表示位置 i 上第 obstacles[i] 道有障碍（0 表示无）。青蛙从第 2 道、位置 0 出发，可向前（位置+1，不变道）或侧跳（变道±1 或±2，算一次侧跳）。求到达位置 n 的最少侧跳次数。DP：dp[l] = 到当前位置在第 l 道的最少侧跳数；每位置先清障碍，再对每道尝试从其他两道跳过来。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 1824. 3 lanes, obstacles[i] marks an obstacle on lane obstacles[i] at position i. Start lane 2 at pos 0; move forward free, side jump (change lane) costs 1. dp[l]=min side jumps to reach current pos on lane l; clear obstacles then relax. Time O(n), space O(1).',
  },
  tags: ['dp', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
