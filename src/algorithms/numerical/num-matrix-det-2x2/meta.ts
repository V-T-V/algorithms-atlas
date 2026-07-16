// 2×2 行列式 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-matrix-det-2x2',
  categoryId: 'numerical',
  title: { zh: '2×2 行列式', en: '2x2 Matrix Determinant' },
  summary: { zh: '计算 2×2 矩阵行列式。', en: 'Determinant of a 2x2 matrix.' },
  description: { zh: '|A|=ad-bc。', en: '|A|=ad-bc.' },
  tags: ['numerical', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
