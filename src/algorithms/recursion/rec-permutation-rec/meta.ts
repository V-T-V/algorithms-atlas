// 递归排列数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-permutation-rec',
  categoryId: 'recursion',
  title: { zh: '递归排列数', en: 'Recursive Permutation (P(n,k))' },
  summary: {
    zh: 'P(n,k) = n · P(n−1, k−1)。从 n 中选 k 个的有序排列数。',
    en: 'P(n,k) = n · P(n−1, k−1). Ordered arrangements of k from n.',
  },
  description: {
    zh: '排列数：P(n,k) = n!/(n−k)!，基线 P(n,0)=1。',
    en: 'Permutation count: P(n,k) = n!/(n−k)!, base P(n,0)=1.',
  },
  tags: ['recursion', 'combinatorics', 'permutation'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
