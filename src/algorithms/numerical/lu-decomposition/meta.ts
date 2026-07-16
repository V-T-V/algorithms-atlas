// LU 分解 (Doolittle) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lu-decomposition',
  categoryId: 'numerical',
  title: { zh: 'LU 分解 (Doolittle)', en: 'LU Decomposition (Doolittle)' },
  summary: {
    zh: '把矩阵分解为下三角 L 与上三角 U。',
    en: 'Factor a matrix into a lower-triangular L and an upper-triangular U.',
  },
  description: {
    zh: 'LU 分解把方阵 A 写成 A = L U，其中 L 是单位下三角（对角线为 1），U 是上三角。Doolittle 算法逐行/逐列交替计算：对每个 (i,j)，先求 U[i][j] = A[i][j] - Σ U[k][j]·L[i][k]（k<i），再求 L[i][j] = (A[i][j] - Σ U[k][j]·L[i][k]) / U[j][j]（i>j）。LU 可反复用前/回代求解 Ax=b。',
    en: "LU decomposition factors a square matrix A into A = L U where L is unit lower-triangular (diagonal 1) and U is upper-triangular. Doolittle's algorithm interleaves rows/columns: for each (i,j) compute U[i][j] = A[i][j] - Σ U[k][j]·L[i][k] (k<i), then L[i][j] = (A[i][j] - Σ U[k][j]·L[i][k]) / U[j][j] (i>j). LU enables cheap forward/back substitution to solve Ax=b repeatedly.",
  },
  tags: ['numerical', 'linear-algebra', 'decomposition'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
