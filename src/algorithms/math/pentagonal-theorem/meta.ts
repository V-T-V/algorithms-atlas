import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pentagonal-theorem',
  categoryId: 'math',
  title: { zh: '五边形数定理', en: 'Pentagonal Number Theorem' },
  summary: {
    zh: '欧拉五边形数定理把划分数计算降到 O(n√n)。',
    en: "Euler's pentagonal number theorem reduces partition numbers to O(n√n).",
  },
  description: {
    zh: '欧拉五边形数定理指出 ∏_{i≥1}(1-x^i) = Σ_{k=-∞}^{∞} (-1)^k x^{k(3k-1)/2}，其中 k(3k-1)/2 是（广义）五边形数 1,2,5,7,12,15,…。结合划分数的生成函数 ∏(1-x^i)^{-1}，得到递推 p(n) = Σ_{k≠0} (-1)^{k-1} p(n - g_k)，g_k 为第 k 个广义五边形数。这把划分数的 计算 从 O(n²) 降到 O(n√n) 时间、O(n) 空间，是计算 p(n) 的最优经典方法之一。',
    en: "Euler's pentagonal number theorem states ∏(1-x^i) = Σ (-1)^k x^{k(3k-1)/2}, where k(3k-1)/2 gives the generalized pentagonal numbers 1,2,5,7,12,15,... Combining with the partition generating function ∏(1-x^i)^{-1} yields p(n) = Σ_{k≠0} (-1)^{k-1} p(n - g_k), reducing partition computation from O(n²) to O(n√n) time and O(n) space — a classic optimal method for p(n).",
  },
  tags: ['math', 'combinatorics', 'partition', 'pentagonal', 'euler', 'generating-function'],
  complexity: { time: 'O(n√n)', space: 'O(n)' },
};
