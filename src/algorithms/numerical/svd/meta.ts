// 奇异值分解（SVD）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-svd',
  categoryId: 'numerical',
  title: { zh: '奇异值分解（SVD）', en: 'Singular Value Decomposition' },
  summary: {
    zh: '把矩阵分解为 A = U·Σ·Vᵀ；用一侧正交化（One-Sided Jacobi）求奇异值与向量。',
    en: 'Factor A = U·Σ·Vᵀ via One-Sided Jacobi rotation to get singular values and vectors.',
  },
  description: {
    zh:
      '奇异值分解（Singular Value Decomposition, SVD）：任一 m×n 矩阵 A 可分解为 A = U·Σ·Vᵀ，' +
      '其中 U、V 为正交矩阵，Σ 为对角阵（对角元即奇异值，按从大到小排列）。' +
      '\n本实现用「单边 Jacobi」算法：' +
      '\n- 对 A 的列两两做 Givens 旋转使其列向量正交' +
      '\n- 收敛后：AV = U·Σ（列正交归一）' +
      '\n  · 奇异值 σ_i = |AV[:,i]|' +
      '\n  · 左奇异向量 U[:,i] = AV[:,i] / σ_i' +
      '\n  · 右奇异向量即 V 的列' +
      '\n- 应用：主成分分析（PCA）、矩阵低秩近似、最小二乘、推荐系统、图像压缩。' +
      '\n- 时间 `O(n²·k)`（k 次扫描），空间 `O(mn)`。',
    en:
      'Singular Value Decomposition (SVD): any m×n matrix A factors as A = U·Σ·Vᵀ, where U and V are ' +
      'orthogonal and Σ is diagonal (the singular values, sorted descending). ' +
      '\nThis implementation uses the One-Sided Jacobi algorithm: ' +
      '\n- Pairwise Givens rotations orthogonalize the columns of A ' +
      '\n- After convergence: AV = U·Σ with orthonormal columns ' +
      '\n  · singular value σ_i = |AV[:,i]| ' +
      '\n  · left singular vector U[:,i] = AV[:,i] / σ_i ' +
      '\n  · right singular vectors are the columns of V ' +
      '\n- Applications: PCA, low-rank approximation, least squares, recommender systems, image compression. ' +
      '\nTime O(n²·k) (k sweeps), space O(mn).',
  },
  tags: ['numerical', 'linear-algebra', 'svd', 'matrix-factorization'],
  complexity: { time: 'O(n²·k)', space: 'O(mn)' },
};
