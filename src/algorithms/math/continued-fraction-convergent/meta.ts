import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'continued-fraction-convergent',
  categoryId: 'math',
  title: { zh: '连分数渐近分数', en: 'Continued Fraction Convergents' },
  summary: {
    zh: '由连分数系数 [a0;a1,…] 用递推求渐近分数 h_k/k_k。',
    en: 'Compute convergents h_k/k_k from continued-fraction coefficients via recurrence.',
  },
  description: {
    zh: '简单连分数 [a0; a1, a2, …, an]（a0 整数，a1..an 正整数）的「渐近分数」是逐步截断得到的近似分数，且每个都是相应精度的最佳有理逼近。递推公式：h_{-2}=0、h_{-1}=1、h_k=a_k·h_{k-1}+h_{k-2}；k 同理（错位一格）。例如 √2 的连分数 [1;2,2,2,…] 的渐近分数 1/1, 3/2, 7/5, 17/12,… 交替逼近 √2。本实现用 BigInt 计算避免大数溢出。与 continued-fraction（把实数展开成系数）互补。',
    en: 'The convergents of a simple continued fraction [a0; a1, ..., an] (a0 integer, a1..an positive) are the successive truncations, each a best rational approximation at its precision. Recurrence: h_{-2}=0, h_{-1}=1, h_k = a_k·h_{k-1} + h_{k-2}; same for k (offset by one). E.g. sqrt(2) = [1;2,2,2,...] yields 1/1, 3/2, 7/5, 17/12, ... This implementation uses BigInt to avoid overflow. Complements continued-fraction (which expands a real into coefficients).',
  },
  tags: ['math', 'number-theory', 'continued-fraction', 'approximation', 'rational'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
