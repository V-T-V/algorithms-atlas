// 矩阵转置 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-matrix-transpose',
  categoryId: 'numerical',
  title: { zh: '矩阵转置', en: 'Matrix Transpose' },
  summary: { zh: '交换行列下标。', en: 'Swap row and column indices.' },
  description: { zh: 'Aᵀ[i][j]=A[j][i]。', en: 'Aᵀ[i][j]=A[j][i].' },
  tags: ['numerical', 'matrix'],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
