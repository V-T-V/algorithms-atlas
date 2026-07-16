import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-robber-6',
  categoryId: 'dp',
  title: { zh: '打家劫舍（环形）', en: 'House Robber (Circular)' },
  summary: {
    zh: '首尾相连的环形街，不能同时偷相邻两家，求最大金额。',
    en: 'Houses in a circle; cannot rob two adjacent; maximize loot.',
  },
  description: {
    zh: '环形：偷首不偷尾，或偷尾不偷首。在 nums[0..n-2] 和 nums[1..n-1] 各跑一次线性 dp 取最大。',
    en: 'Circular: max of robbing nums[0..n-2] and nums[1..n-1], each via linear dp.',
  },
  tags: ['dp', 'house-robber', 'circular'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
