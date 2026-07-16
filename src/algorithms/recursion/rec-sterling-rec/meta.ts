// 递归斯特林数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-sterling-rec',
  categoryId: 'recursion',
  title: { zh: '递归斯特林数', en: 'Recursive Stirling (2nd kind)' },
  summary: {
    zh: 'S(n,k) = k·S(n−1,k) + S(n−1,k−1)。把 n 个不同元素分成 k 个非空子集的方法数。',
    en: 'S(n,k) = k·S(n−1,k) + S(n−1,k−1). Number of ways to partition n distinct elements into k non-empty subsets.',
  },
  description: {
    zh: '第二类斯特林数：基线 S(0,0)=1, S(n,0)=0 (n>0), S(0,k)=0 (k>0)。',
    en: 'Stirling numbers of the 2nd kind: bases S(0,0)=1, S(n,0)=0 (n>0), S(0,k)=0 (k>0).',
  },
  tags: ['recursion', 'combinatorics', 'stirling'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
