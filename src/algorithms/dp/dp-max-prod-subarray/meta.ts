import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-max-prod-subarray',
  categoryId: 'dp',
  title: { zh: '最大乘积子数组', en: 'Maximum Product Subarray' },
  summary: {
    zh: '找出数组中乘积最大的连续子数组，返回该乘积。',
    en: 'Find the contiguous subarray with the largest product.',
  },
  description: {
    zh: 'LeetCode 152。给定整数数组 nums（含负数、零），求乘积最大的连续子数组。难点：负数会让最小变最大。维护当前最大 curMax 与当前最小 curMin，遇 nums[i] 时三者取 max/min：curMax=max(nums[i], curMax·nums[i], curMin·nums[i])，curMin=min(...)。滚动更新全局 ans。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 152. Track running max and min products (negatives flip them). Update curMax=max(num,curMax*num,curMin*num), curMin=min(...), ans=max(ans,curMax). Time O(n), space O(1).',
  },
  tags: ['dp', 'array', 'leetcode', 'product'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
