// 二项式系数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-binomial-coeff',
  categoryId: 'numerical',
  title: { zh: '二项式系数', en: 'Binomial Coefficient' },
  summary: { zh: '计算 C(n,k)=n!/(k!(n-k)!)。', en: 'Compute C(n,k)=n!/(k!(n-k)!).' },
  description: {
    zh: '用乘法累积避免大阶乘溢出。',
    en: 'Accumulate via multiplication to avoid large-factorial overflow.',
  },
  tags: ['numerical', 'combinatorics'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
