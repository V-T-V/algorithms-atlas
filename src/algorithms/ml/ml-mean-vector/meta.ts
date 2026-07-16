// 均值向量 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-mean-vector',
  categoryId: 'ml',
  title: { zh: '均值向量', en: 'Mean Vector' },
  summary: { zh: '计算样本矩阵每列均值。', en: 'Per-column mean of a sample matrix.' },
  description: { zh: 'μⱼ=(1/n)Σxᵢⱼ。', en: 'μⱼ=(1/n)Σxᵢⱼ.' },
  tags: ['ml', 'statistics'],
  complexity: { time: 'O(nd)', space: 'O(d)' },
};
