// 递归贝尔数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-bell-rec',
  categoryId: 'recursion',
  title: { zh: '递归贝尔数', en: 'Recursive Bell Numbers' },
  summary: {
    zh: 'B(n) = Σ_{k=0}^{n} S(n,k)，n 个元素的划分数总数。',
    en: 'B(n) = Σ_{k=0}^{n} S(n,k). Total number of partitions of n elements.',
  },
  description: {
    zh: '贝尔数：基线 B(0)=1；也可用 B(n+1)=Σ C(n,k)·B(k) 递推。',
    en: 'Bell numbers: base B(0)=1; alternatively B(n+1)=Σ C(n,k)·B(k).',
  },
  tags: ['recursion', 'combinatorics', 'bell'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
