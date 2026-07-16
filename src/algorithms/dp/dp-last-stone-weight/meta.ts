import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-last-stone-weight',
  categoryId: 'dp',
  title: { zh: '最后一块石头重量', en: 'Last Stone Weight II' },
  summary: {
    zh: '任选两块石头相撞粉碎，差值留下，求最后一块石头的最小可能重量。',
    en: 'Smash two stones each turn; the difference remains; minimize the last stone weight.',
  },
  description: {
    zh: 'LeetCode 1049。给定正整数数组 stones 表示每块石头的重量。每轮任选两块石头 x、y（x≤y）相撞：若 x==y 全碎；否则剩 y-x。最终剩一块（或 0）。这等价于把石头分成两堆使两堆和的差最小（同 min-diff-subset 问题）：sum-2·s1，其中 s1 是不超过 ⌊sum/2⌋ 的最大子集和。时间 O(n·sum)，空间 O(sum)。',
    en: 'LeetCode 1049. Each turn smash two stones; if equal both gone, else keep the difference. Minimize the final stone. Equivalent to partitioning stones into two piles minimizing the sum difference: answer = sum-2·s1 where s1 ≤ ⌊sum/2⌋ is the max reachable subset sum. Time O(n·sum), space O(sum).',
  },
  tags: ['dp', 'knapsack', 'leetcode'],
  complexity: { time: 'O(n·sum)', space: 'O(sum)' },
};
