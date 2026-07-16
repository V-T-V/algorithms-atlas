// 均值与方差 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-mean-variance',
  categoryId: 'numerical',
  title: { zh: '均值与方差', en: 'Mean and Variance' },
  summary: { zh: '计算样本均值与方差。', en: 'Compute sample mean and variance.' },
  description: { zh: 'μ=Σxᵢ/n，σ²=Σ(xᵢ-μ)²/(n-1)。', en: 'μ=Σxᵢ/n; σ²=Σ(xᵢ-μ)²/(n-1).' },
  tags: ['numerical', 'statistics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
