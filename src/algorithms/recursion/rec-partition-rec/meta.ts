// 递归整数划分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-partition-rec',
  categoryId: 'recursion',
  title: { zh: '递归整数划分', en: 'Recursive Integer Partition' },
  summary: {
    zh: 'P(n,k) = P(n−1,k−1) + P(n−k,k)。把 n 划分为 k 个正整数之和的方法数。',
    en: 'P(n,k) = P(n−1,k−1) + P(n−k,k). Ways to write n as sum of k positive integers.',
  },
  description: {
    zh: '整数划分：基线 P(n,1)=1, P(n,n)=1, P(n,k)=0 (k>n 或 k=0,n>0)。',
    en: 'Integer partition: bases P(n,1)=1, P(n,n)=1, P(n,k)=0 (k>n or k=0,n>0).',
  },
  tags: ['recursion', 'combinatorics', 'partition'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
