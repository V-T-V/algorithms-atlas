// 子集II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-subset-unique',
  categoryId: 'backtracking',
  title: { zh: '子集II', en: 'Subsets II' },
  summary: {
    zh: '枚举含重复元素数组的所有不重复子集。',
    en: 'All distinct subsets of array with duplicates.',
  },
  description: {
    zh: '排序后回溯，跳过同层重复。',
    en: 'Sort then skip duplicates at same level. O(n*2^n).',
  },
  tags: ['backtracking', 'subset'],
  complexity: { time: 'O(n*2^n)', space: 'O(n)' },
};
