// 加油站 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-gas-3',
  categoryId: 'greedy',
  title: { zh: '加油站', en: 'Gas Station' },
  summary: {
    zh: '环形路 gas[i] − cost[i]；若总油 ≥ 总耗则存在唯一起点。',
    en: 'On a circuit, gas[i] − cost[i]; if total gas ≥ total cost, a unique start exists.',
  },
  description: {
    zh: 'LeetCode 134 加油站：n 个加油站环形排列，gas[i] 和 cost[i] 表示油量和到下一站消耗。总油 ≥ 总耗时存在唯一可完成起点。',
    en: 'LeetCode 134 Gas Station: n stations in a circuit, gas[i] and cost[i]. If total gas ≥ total cost, a unique feasible start exists.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
