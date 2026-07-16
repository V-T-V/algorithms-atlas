// 大小为k的子集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-subsets-size-k',
  categoryId: 'backtracking',
  title: { zh: '大小为k的子集', en: 'Subsets of Size K' },
  summary: {
    zh: '枚举 n 元素中大小恰为 k 的所有子集。',
    en: 'All subsets of size exactly k from n elements.',
  },
  description: { zh: '回溯选入，达到 k 即记录。', en: 'Backtrack, record when size k. O(C(n,k)).' },
  tags: ['backtracking', 'subset'],
  complexity: { time: 'O(C(n,k))', space: 'O(k)' },
};
