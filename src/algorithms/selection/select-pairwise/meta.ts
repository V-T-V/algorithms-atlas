// 锦标赛选最小（两两比较法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'select-pairwise',
  categoryId: 'selection',
  title: { zh: '锦标赛选最小（两两比较）', en: 'Tournament Select (Pairwise)' },
  summary: {
    zh: '用淘汰赛二叉树两两比较选出最小元素，共 n−1 次比较。',
    en: 'Single-elimination tournament tree finds the min in n−1 comparisons.',
  },
  description: {
    zh: '把 n 个元素视为种子，进行单淘汰锦标赛：每轮把相邻两个元素配对，较小的晋级，直到只剩一个冠军——即全局最小。\n\n- 每轮淘汰一半，共 ⌈log₂n⌉ 轮\n- 总比较次数恰好 n−1\n- 锦标赛树本身可作为后续「找次小」的基础（次小必在某轮输给冠军）\n\n这是「同时找最小」的最优比较次数下界 n−1。',
    en: 'Treat n elements as seeds in a single-elimination tournament: pair adjacent elements each round, the smaller advances, until one champion remains — the global minimum. Exactly n−1 comparisons over ⌈log₂n⌉ rounds. This meets the lower bound for finding the minimum.',
  },
  tags: ['selection', 'tournament', 'minimum', 'comparison-model'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
