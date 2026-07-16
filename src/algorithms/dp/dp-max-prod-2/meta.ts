import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-max-prod-2',
  categoryId: 'dp',
  title: { zh: '乘积最大子数组', en: 'Maximum Product Subarray' },
  summary: {
    zh: '同时维护当前最大积与最小积，遇负数翻转，求全局最大乘积。',
    en: 'Track current max and min products (swap on negative); return global maximum.',
  },
  description: {
    zh: 'LeetCode 152。由于负数会让最小变最大，每步同时维护 curMax 与 curMin。遇到负数时先交换两者。ans 持续取最大。',
    en: 'LC 152. Negatives can flip min to max, so maintain both. Swap on negative, then curMax/curMin = max/min of (cur·x, x).',
  },
  tags: ['dp', 'product', 'subarray'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
