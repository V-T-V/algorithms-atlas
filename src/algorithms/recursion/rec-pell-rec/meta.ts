// 递归佩尔数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-pell-rec',
  categoryId: 'recursion',
  title: { zh: '递归佩尔数', en: 'Recursive Pell' },
  summary: {
    zh: 'P(n) = 2·P(n−1) + P(n−2)，基线 P(0)=0, P(1)=1。',
    en: 'P(n) = 2·P(n−1) + P(n−2) with P(0)=0, P(1)=1.',
  },
  description: {
    zh: '佩尔数：系数为 2 的线性递推，比斐波那契增长更快。',
    en: 'Pell numbers: linear recurrence with coefficient 2; grows faster than Fibonacci.',
  },
  tags: ['recursion', 'linear-recurrence'],
  complexity: { time: 'O(c^n)', space: 'O(n)' },
};
