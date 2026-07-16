import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-super-washing',
  categoryId: 'dp',
  title: { zh: '超级洗衣机', en: 'Super Washing Machines' },
  summary: {
    zh: '每台洗衣机可向相邻机器移动一件衣服，求使所有机器衣服数相等的最少操作轮数。',
    en: 'Each move shifts one dress to an adjacent machine; min rounds to equalize all machines.',
  },
  description: {
    zh: 'LeetCode 517。n 台洗衣机排成一行，machines[i] 为衣服数。每轮每台机器最多向相邻一台送出一件衣服。求使所有机器衣服数相等的最少轮数（不可能返回 -1）。贪心：若总衣服数不能被 n 整除则无解。设 avg=总/n，gain[i]=machines[i]-avg（需净流出为正）。对每个位置 i 累积流量 flow+=gain[i]，答案=max over i (max(|flow|, gain[i]))。即「累积流量绝对值」与「单点净流出」取最大值。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 517. If total not divisible by n, return -1. Let avg=total/n, gain[i]=machines[i]-avg, flow=running sum of gain. Answer=max over i of max(|flow|, gain[i]). Time O(n), space O(1).',
  },
  tags: ['dp', 'greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
