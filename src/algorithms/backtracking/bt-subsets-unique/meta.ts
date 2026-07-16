// 去重子集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-subsets-unique',
  categoryId: 'backtracking',
  title: { zh: '去重子集 (Subsets II)', en: 'Subsets with Duplicates' },
  summary: {
    zh: '排序后回溯，对同层重复元素跳过，枚举所有不重复子集。',
    en: 'Sort then backtrack, skipping same-level duplicates to list all unique subsets.',
  },
  description: {
    zh: '先对数组排序，回溯时若当前元素与同层前一个相同则跳过，从而避免生成重复子集。',
    en: 'Sort the array first; during backtracking skip an element equal to its previous sibling on the same recursion level to avoid duplicate subsets.',
  },
  tags: ['backtracking', 'subset', 'dedup'],
  complexity: { time: 'O(n · 2^n)', space: 'O(n)' },
};
