// 矩阵快速幂 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'matrix-power',
  categoryId: 'math',
  title: { zh: '矩阵快速幂', en: 'Matrix Fast Exponentiation' },
  summary: {
    zh: '用快速幂在 O(k^3 log n) 内计算方阵 A 的 n 次幂。',
    en: 'Compute A^n for a square matrix in O(k^3 log n) via binary exponentiation.',
  },
  description: {
    zh: '把快速幂推广到矩阵：把指数 n 写成二进制，逐位扫描，每位让矩阵自乘（平方），当该位为 1 时把当前矩阵乘入结果。常用于加速线性递推（如斐波那契）。k×k 矩阵乘法 O(k^3)，共 O(log n) 次乘法，总 O(k^3 log n)。',
    en: 'Generalize fast exponentiation to matrices: scan exponent bits, square the matrix each step, multiply into the result on a 1-bit. Commonly used to accelerate linear recurrences (e.g. Fibonacci). A k×k multiply is O(k^3); O(log n) multiplies give O(k^3 log n) total.',
  },
  tags: ['math', 'matrix', 'exponentiation', 'linear-algebra'],
  complexity: { time: 'O(k^3 log n)', space: 'O(k^2)' },
};
