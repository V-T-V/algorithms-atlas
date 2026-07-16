// Pell 方程 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pell-equation',
  categoryId: 'math',
  title: { zh: 'Pell 方程', en: 'Pell Equation' },
  summary: {
    zh: '用连分数法求 x²−D·y²=1 的最小正整数解 (x,y)。',
    en: 'Find the minimal positive integer solution (x,y) of x²−D·y²=1 via continued fractions.',
  },
  description: {
    zh: 'Pell 方程 x² − D·y² = 1（D 为非完全平方正整数）总有无穷多正整数解，其最小正解（基础解）可由 √D 的连分数展开求得：设 √D 的连分数周期部分为 [a0; a1,...,aL]，计算其收敛分数 (h,k)，当周期长度 L 为偶数时取第 L−1 个收敛子，奇数时取第 2L−1 个，即为 (x,y)。基础解生成所有解：(x_k+y_k√D)=(x_1+y_1√D)^k。BigInt 精确。',
    en: 'The Pell equation x² − D·y² = 1 (D a non-square positive integer) has infinitely many positive solutions; the minimal one (fundamental solution) is obtained from the continued-fraction expansion of √D. With period [a0; a1,...,aL], the convergent at index L−1 (if L even) or 2L−1 (if L odd) gives (x,y). All solutions follow from (x_k+y_k√D)=(x_1+y_1√D)^k. Exact BigInt.',
  },
  tags: ['math', 'number-theory', 'pell', 'continued-fraction', 'diophantine'],
  complexity: { time: 'O(√D log D)', space: 'O(log D)' },
};
