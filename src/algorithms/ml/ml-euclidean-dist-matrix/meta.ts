// 欧氏距离矩阵 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-euclidean-dist-matrix',
  categoryId: 'ml',
  title: { zh: '欧氏距离矩阵', en: 'Euclidean Distance Matrix' },
  summary: { zh: '计算样本两两欧氏距离。', en: 'Pairwise Euclidean distances between samples.' },
  description: { zh: 'D[i][j] = ||xᵢ - xⱼ||₂。', en: 'D[i][j] = ||xᵢ - xⱼ||₂.' },
  tags: ['ml', 'distance'],
  complexity: { time: 'O(n^2 d)', space: 'O(n^2)' },
};
