// QR 分解 (Gram-Schmidt) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'qr-decomposition',
  categoryId: 'numerical',
  title: { zh: 'QR 分解 (Gram-Schmidt)', en: 'QR Decomposition (Gram-Schmidt)' },
  summary: {
    zh: '把矩阵分解为正交 Q 与上三角 R。',
    en: 'Factor a matrix into an orthogonal Q and an upper-triangular R.',
  },
  description: {
    zh: 'QR 分解把矩阵 A 写成 A = Q R，其中 Q 的列两两正交（单位化），R 是上三角。经典 Gram-Schmidt 过程：依次处理 A 的每一列 a_k，减去其在已建立正交基 q_1..q_{k-1} 上的投影，得到剩余向量，归一化为 q_k；投影系数填入 R。QR 用于最小二乘、特征值（QR 算法）等。',
    en: 'QR decomposition writes A = Q R where Q has orthonormal columns and R is upper triangular. The classical Gram-Schmidt process: for each column a_k of A, subtract its projections onto the already-built orthonormal basis q_1..q_{k-1}, normalize the residual to get q_k, and fill the projection coefficients into R. QR underlies least squares and the QR eigenvalue algorithm.',
  },
  tags: ['numerical', 'linear-algebra', 'decomposition'],
  complexity: { time: 'O(n²·m)', space: 'O(n·m)' },
};
