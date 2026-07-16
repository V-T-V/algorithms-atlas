// QR 迭代求特征值 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-eigenvalue-qr',
  categoryId: 'numerical',
  title: { zh: 'QR 迭代求特征值', en: 'QR Iteration for Eigenvalues' },
  summary: {
    zh: '反复对 A 做 QR 分解 A=QR 再置 A=RQ，收敛后对角元即特征值（带 Wilkinson 平移加速）。',
    en: 'Repeatedly factor A=QR then set A=RQ; the diagonal converges to eigenvalues (Wilkinson shift).',
  },
  description: {
    zh:
      'QR 迭代求特征值：对 n×n 方阵 A 反复执行：' +
      '\n1. A_k = Q_k · R_k（QR 分解，可用 Householder 或 Gram-Schmidt）' +
      '\n2. A_{k+1} = R_k · Q_k' +
      '\n经过若干次迭代后，A 收敛为（近似）上三角，其对角元即 A 的特征值。' +
      '\n- 实对称矩阵收敛到对角矩阵；一般矩阵可能得到 2×2 块（对应复特征值）' +
      '\n- Wilkinson 平移可大幅加速收敛' +
      '\n- 本实现用 Gram-Schmidt 做 QR 分解，加入 Wilkinson 平移，便于教学' +
      '\n- 时间 `O(n³·k)`（k 次迭代），空间 `O(n²)`。',
    en:
      'QR iteration for eigenvalues: repeatedly apply to an n×n matrix A: ' +
      '\n1. A_k = Q_k · R_k (QR factorization, Householder or Gram-Schmidt) ' +
      '\n2. A_{k+1} = R_k · Q_k ' +
      'After several iterations A converges to (nearly) upper-triangular; its diagonal holds the eigenvalues. ' +
      '\n- Real symmetric matrices converge to a diagonal; general matrices may yield 2×2 blocks (complex eigenvalues) ' +
      '\n- Wilkinson shift greatly accelerates convergence ' +
      '\n- This implementation uses Gram-Schmidt QR with Wilkinson shift for clarity ' +
      '\nTime O(n³·k) (k iterations), space O(n²).',
  },
  tags: ['numerical', 'linear-algebra', 'eigenvalue', 'qr'],
  complexity: { time: 'O(n³·k)', space: 'O(n²)' },
};
