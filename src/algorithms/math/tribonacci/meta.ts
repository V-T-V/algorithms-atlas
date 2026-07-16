// Tribonacci · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tribonacci',
  categoryId: 'math',
  title: { zh: 'Tribonacci 数', en: 'Tribonacci Number' },
  summary: {
    zh: '三阶斐波那契 T(n)=T(n-1)+T(n-2)+T(n-3)，矩阵快速幂 O(log n)。',
    en: 'Third-order Fibonacci T(n)=T(n-1)+T(n-2)+T(n-3) via matrix exponentiation in O(log n).',
  },
  description: {
    zh: 'Tribonacci 数定义：T(0)=0, T(1)=0, T(2)=1，之后 T(n)=T(n-1)+T(n-2)+T(n-3)。前几项 0,0,1,1,2,4,7,13,24。用 3×3 转移矩阵 [[1,1,1],[1,0,0],[0,1,0]] 的快速幂可在 O(log n) 内求 T(n)，远快于朴素 O(n) 递推。BigInt 精确。',
    en: 'Tribonacci numbers: T(0)=0, T(1)=0, T(2)=1, then T(n)=T(n-1)+T(n-2)+T(n-3). First terms 0,0,1,1,2,4,7,13,24. Using fast exponentiation of the 3×3 transition matrix [[1,1,1],[1,0,0],[0,1,0]], T(n) can be computed in O(log n), much faster than the O(n) iteration. Exact BigInt.',
  },
  tags: ['math', 'sequence', 'tribonacci', 'matrix-exponentiation'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
