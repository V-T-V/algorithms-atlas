// Lucas 序列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lucas-sequence',
  categoryId: 'math',
  title: { zh: 'Lucas 序列', en: 'Lucas Sequence' },
  summary: {
    zh: '用矩阵快速幂 O(log n) 计算 Lucas 序列 U_n(P,Q)、V_n(P,Q)。',
    en: 'Compute Lucas sequences U_n(P,Q) and V_n(P,Q) in O(log n) via matrix exponentiation.',
  },
  description: {
    zh: 'Lucas 序列由参数 (P,Q) 定义：U_0=0, U_1=1, U_n = P·U_{n-1} − Q·U_{n-2}；V_0=2, V_1=P, V_n = P·V_{n-1} − Q·V_{n-2}。斐波那契是 U(1,−1)，Lucas 数是 V(1,−1)，Pell 是 U(2,−1)。用 2×2 转移矩阵 [[P,−Q],[1,0]] 快速幂可在 O(log n) 内求出。BigInt 精确。',
    en: 'Lucas sequences parameterized by (P,Q): U_0=0, U_1=1, U_n=P·U_{n-1}−Q·U_{n-2}; V_0=2, V_1=P, V_n=P·V_{n-1}−Q·V_{n-2}. Fibonacci is U(1,−1), Lucas numbers are V(1,−1), Pell is U(2,−1). Fast exponentiation of the 2×2 matrix [[P,−Q],[1,0]] gives O(log n). Exact BigInt.',
  },
  tags: ['math', 'sequence', 'lucas', 'matrix-exponentiation'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
