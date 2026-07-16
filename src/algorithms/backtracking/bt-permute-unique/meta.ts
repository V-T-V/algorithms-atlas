// 全排列II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-permute-unique',
  categoryId: 'backtracking',
  title: { zh: '全排列II', en: 'Permutations II' },
  summary: {
    zh: '枚举含重复元素数组的所有不重复全排列。',
    en: 'All distinct permutations of array with duplicates.',
  },
  description: {
    zh: '排序 + 回溯 + 跳过已用与同层重复。',
    en: 'Sort, skip used and same-level duplicates. O(n*n!).',
  },
  tags: ['backtracking', 'permutation'],
  complexity: { time: 'O(n*n!)', space: 'O(n)' },
};
