// 矩阵乘法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-matrix-mult',
  categoryId: 'numerical',
  title: { zh: '矩阵乘法', en: 'Matrix Multiplication' },
  summary: { zh: '朴素三重循环矩阵乘法。', en: 'Naive triple-loop matrix multiplication.' },
  description: { zh: 'C[i][j]=Σ A[i][k]·B[k][j]。', en: 'C[i][j]=Σ A[i][k]·B[k][j].' },
  tags: ['numerical', 'matrix'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
