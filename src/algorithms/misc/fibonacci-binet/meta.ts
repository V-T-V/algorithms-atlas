// 斐波那契（Binet 公式 + 矩阵快速幂）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-binet',
  categoryId: 'misc',
  title: {
    zh: '斐波那契（Binet 公式 + 矩阵快速幂）',
    en: 'Fibonacci (Binet Formula + Matrix Exponentiation)',
  },
  summary: {
    zh: '用闭式 Binet 公式 O(1) 近似，或矩阵快速幂 O(log n) 精确求 F(n)。',
    en: 'Closed-form Binet for O(1) approximation, or matrix exponentiation for O(log n) exact F(n).',
  },
  description: {
    zh: '斐波那契数列 F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。求第 n 项有多种方法：朴素递归 O(φ^n) 指数级；迭代 O(n)；闭式 Binet 公式 F(n) = (φ^n − ψ^n)/√5，其中 φ=(1+√5)/2≈1.618（黄金比），ψ=(1−√5)/2≈−0.618，可在 O(1) 内给出近似值（受浮点精度限制，n 较大时有误差）；矩阵快速幂利用 [[1,1],[1,0]]^n = [[F(n+1),F(n)],[F(n),F(n-1)]]，通过二进制快速幂在 O(log n) 内精确计算，适合大 n。本实现同时提供 Binet 浮点近似与矩阵快速幂精确值，并演示快速幂的逐次平方过程。',
    en: 'The Fibonacci sequence satisfies F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). Computing the n-th term has many methods: naive recursion is O(φ^n) exponential; iteration is O(n); the closed-form Binet formula F(n) = (φ^n − ψ^n)/√5 with φ=(1+√5)/2≈1.618 (golden ratio) and ψ=(1−√5)/2≈−0.618 gives an O(1) approximation (limited by floating-point precision, accumulating error for large n); matrix exponentiation exploits [[1,1],[1,0]]^n = [[F(n+1),F(n)],[F(n),F(n-1)]] and computes the exact value in O(log n) via binary fast exponentiation, suitable for large n. This implementation offers both the Binet floating-point approximation and the exact matrix-power value, and visualises the successive-squaring steps of fast exponentiation.',
  },
  tags: ['misc', 'number-theory', 'matrix', 'fast-exponentiation'],
  complexity: { time: 'O(log n) 矩阵 / O(1) Binet', space: 'O(1)' },
};
