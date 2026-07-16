// 递归组合（有序划分）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-composition-rec',
  categoryId: 'recursion',
  title: { zh: '递归组合（有序划分）', en: 'Recursive Composition' },
  summary: {
    zh: '把 n 写成 k 个正整数之和（顺序不同算不同方法）。comp(n,k) = comp(n−1,k−1) + comp(n−k,k)。',
    en: 'Write n as sum of k positive integers where order matters. comp(n,k) = comp(n−1,k−1) + comp(n−k,k).',
  },
  description: {
    zh: '组合（有序划分）：与无序的整数划分不同，1+2 和 2+1 算两种。基线 comp(0,0)=1，comp(n,0)=0 (n>0)，comp(n,k)=0 (k>n)。',
    en: 'Composition (ordered partition): unlike unordered integer partitions, 1+2 and 2+1 are distinct. Bases comp(0,0)=1, comp(n,0)=0 (n>0), comp(n,k)=0 (k>n).',
  },
  tags: ['recursion', 'combinatorics', 'composition'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
