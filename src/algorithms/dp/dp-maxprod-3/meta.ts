import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-maxprod-3',
  categoryId: 'dp',
  title: { zh: '最大子数组乘积', en: 'Maximum Product Subarray' },
  summary: {
    zh: '数组中连续子数组的最大乘积（含负数）。',
    en: 'Maximum product of a contiguous subarray (may include negatives).',
  },
  description: {
    zh: '同时维护当前最大乘积 maxP 与最小乘积 minP（因为负负得正）。遇到负数交换二者。ans=max(ans, maxP)。',
    en: 'Track running max and min product (min can flip to max via negative).',
  },
  tags: ['dp', 'maximum-product', 'subarray'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
