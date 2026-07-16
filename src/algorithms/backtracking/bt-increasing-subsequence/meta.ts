// 递增子序列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-increasing-subsequence',
  categoryId: 'backtracking',
  title: { zh: '递增子序列', en: 'Increasing Subsequences' },
  summary: {
    zh: '回溯找出数组所有长度 ≥2 的非递减子序列。',
    en: 'Backtracking to find all non-decreasing subsequences of length ≥2.',
  },
  description: {
    zh: '不能排序（要保持原序）。每层用集合去重，跳过本层已用过的值。',
    en: 'No sorting (preserve original order). Use a per-level set to skip values already used at this level.',
  },
  tags: ['backtracking', 'subsequence'],
  complexity: { time: 'O(2^n·n)', space: 'O(n)' },
};
