// Kadane · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kadane',
  categoryId: 'design',
  title: { zh: 'Kadane 最大子数组和', en: "Kadane's Maximum Subarray" },
  summary: {
    zh: 'Kadane 算法 O(n) 求最大子数组和，动态规划经典。',
    en: "Kadane's algorithm finds the maximum subarray sum in O(n) — a DP classic.",
  },
  description: {
    zh: 'Kadane 算法求解「最大子数组和」（连续子数组的元素和最大）问题，是动态规划思想的极致精简：\n\n- 定义 `curMax` = 以当前元素结尾的最大子数组和。\n- 递推：`curMax = max(a[i], curMax + a[i])`（要么把 a[i] 接在前面，要么从 a[i] 重新开始）。\n- 全局最优 `globalMax = max(globalMax, curMax)`。\n\n直观理解：累加和一旦变负，就丢弃前缀重新开始（负前缀只会拖累后续）。时间 O(n)，空间 O(1)。本实现额外记录最优子数组的起止下标 [start, end]，并通过钩子暴露每步状态。',
    en: "Kadane's algorithm solves the 'maximum subarray sum' problem (the contiguous subarray with the largest sum), distilling dynamic programming to its essence:\n\n- Define `curMax` = the maximum subarray sum ending at the current element.\n- Recurrence: `curMax = max(a[i], curMax + a[i])` (either extend the previous run, or start fresh at a[i]).\n- Track `globalMax = max(globalMax, curMax)`.\n\nIntuition: once the running sum goes negative, drop the prefix and restart (a negative prefix only hurts what follows). Time O(n), space O(1). This implementation also records the optimal subarray's [start, end] indices and exposes each step via hooks.",
  },
  tags: ['design', 'dynamic-programming', 'maximum-subarray'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
