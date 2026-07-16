// Fibonacci Mod · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-mod',
  categoryId: 'math',
  title: { zh: '斐波那契取模·矩阵快速幂', en: 'Fibonacci Mod (Matrix Power)' },
  summary: {
    zh: '矩阵快速幂求 F(n) mod m，O(log n)。',
    en: 'Matrix fast exponentiation for F(n) mod m in O(log n).',
  },
  description: {
    zh: '用 2×2 矩阵快速幂计算斐波那契数模 m：[[1,1],[1,0]]^n = [[F(n+1),F(n)],[F(n),F(n-1)]]。结合律 + 平方加速使复杂度 O(log n)。适用于 n 极大（如 1e18）的情况，避免 O(n) 线性递推。所有运算 mod m 防溢出。',
    en: 'Compute Fibonacci mod m via 2×2 matrix exponentiation: [[1,1],[1,0]]^n = [[F(n+1),F(n)],[F(n),F(n-1)]]. Associativity + repeated squaring gives O(log n). Suitable for huge n (e.g. 1e18) avoiding O(n) linear recurrence. All operations mod m.',
  },
  tags: ['math', 'number-theory', 'fibonacci', 'matrix', 'fast-power', 'modular'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
