// 递归二项式系数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-combination-rec',
  categoryId: 'recursion',
  title: { zh: '递归二项式系数', en: 'Recursive Binomial Coefficient' },
  summary: {
    zh: '用帕斯卡递推 C(n,k)=C(n−1,k−1)+C(n−1,k) 递归计算二项式系数。',
    en: 'Compute binomial coefficient via Pascal recurrence C(n,k)=C(n−1,k−1)+C(n−1,k).',
  },
  description: {
    zh: '二项式系数（n 选 k）：基线 C(n,0)=C(n,n)=1。展示组合数学最基本的递推关系——帕斯卡三角。',
    en: "Binomial coefficient (n choose k): bases C(n,0)=C(n,n)=1. Illustrates the most fundamental combinatorial recurrence — Pascal's triangle.",
  },
  tags: ['recursion', 'combinatorics', 'binomial'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
