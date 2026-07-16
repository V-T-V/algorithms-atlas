// 加权中位数（Weighted Median）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'weighted-median',
  categoryId: 'selection',
  title: { zh: '加权中位数', en: 'Weighted Median' },
  summary: {
    zh: '按 value 排序后累计权重，累计达到总权重一半时的 value 即加权中位数。',
    en: 'Sort by value; the value where cumulative weight crosses half the total is the weighted median.',
  },
  description: {
    zh: '加权中位数：给定 (value, weight) 对的集合，存在一个 value，其之前所有项权重之和 < 总权重/2，加上该项后 ≥ 总权重/2。\n\n算法：\n1. 按 value 升序排序；\n2. 计算总权重 W；\n3. 从小到大累计权重 prefix，当 prefix ≥ W/2 时当前项的 value 即为加权中位数。\n\n时间 `O(n log n)`（排序主导），空间 `O(n)`。应用于加权统计、设施选址（1-中位数问题）。',
    en: "Weighted median: given (value, weight) pairs, find the value such that the sum of weights of smaller values is < W/2, and becomes ≥ W/2 once this item is included.\n\nAlgorithm:\n1. Sort by value ascending;\n2. Compute total weight W;\n3. Accumulate prefix weight; when prefix ≥ W/2, the current item's value is the weighted median.\n\nTime `O(n log n)` (sort-bound), space `O(n)`. Used in weighted statistics and facility location (1-median).",
  },
  tags: ['selection', 'sorting', 'statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
