// 划分k个相等子集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-partition-k-equal',
  categoryId: 'backtracking',
  title: { zh: '划分k个相等子集', en: 'Partition into K Equal Subsets' },
  summary: {
    zh: '判断数组能否划分成 k 个和相等的子集。',
    en: 'Can partition array into k equal-sum subsets.',
  },
  description: {
    zh: '总和须被 k 整除，回溯装桶。',
    en: 'Sum divisible by k, backtrack buckets. O(k^n).',
  },
  tags: ['backtracking', 'partition'],
  complexity: { time: 'O(k^n)', space: 'O(n)' },
};
