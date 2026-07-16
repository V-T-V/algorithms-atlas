// Jacobi 特征值算法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jacobi-eigen',
  categoryId: 'numerical',
  title: { zh: 'Jacobi 特征值算法', en: 'Jacobi Eigenvalue Algorithm' },
  summary: {
    zh: '旋转消灭对称矩阵最大非对角元，迭代收敛。',
    en: 'Rotates to zero the largest off-diagonal of a symmetric matrix; iterates to convergence.',
  },
  description: {
    zh: 'Jacobi 特征值算法对实对称矩阵 A 反复做「平面旋转」（Givens 旋转）：每步选最大的非对角元 a_pq，构造旋转角 θ = 0.5·atan2(2a_pq, a_qq - a_pp)，用 J^T A J 把 a_pq 变为 0。反复旋转后非对角元趋于 0，对角元即为特征值，累积的 J 列即为特征向量。',
    en: 'The Jacobi eigenvalue algorithm repeatedly applies plane (Givens) rotations to a real symmetric matrix A: each step picks the largest off-diagonal a_pq, builds angle θ = 0.5·atan2(2a_pq, a_qq - a_pp), and uses J^T A J to zero a_pq. After many sweeps the off-diagonal vanishes; the diagonal holds the eigenvalues and the accumulated J columns the eigenvectors.',
  },
  tags: ['numerical', 'linear-algebra', 'eigenvalue'],
  complexity: { time: 'O(n³·k)', space: 'O(n²)' },
};
