// 加权中位数（排序法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'weighted-median-sort',
  categoryId: 'selection',
  title: { zh: '加权中位数（排序法）', en: 'Weighted Median (Sort-Based)' },
  summary: {
    zh: '按值排序后累加权重，首个使前缀权重大于等于总权一半的元素。',
    en: 'Sort by value, accumulate weights; first prefix reaching half total weight is the weighted median.',
  },
  description: {
    zh: '加权中位数：给定 n 个带非负权重 wᵢ 的元素 xᵢ，加权中位数是满足「按值升序累加，第一个使前缀权重和 ≥ 总权重一半」的元素 xₖ。\n\n排序法实现：\n1. 把元素按值升序排序\n2. 计算总权重 W = Σwᵢ\n3. 从前往后累加权重，累加和首次 ≥ W/2 时停止，对应元素即加权中位数\n\n- 时间 O(n log n)（排序主导），空间 O(n)\n- 简单直观；线性选择法（prune-and-search）可达 O(n)',
    en: 'Weighted median: given values xᵢ with non-negative weights wᵢ, it is the xₖ where the cumulative weight first reaches ≥ half the total. Sort-based: sort by value, sum weights, scan until the running sum ≥ W/2. O(n log n) time, O(n) space; a linear prune-and-search variant also exists.',
  },
  tags: ['selection', 'weighted-median', 'sorting', 'order-statistics'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
