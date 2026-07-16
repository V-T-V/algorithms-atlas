// 对角 CMA-ES · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-cma-es-diag-2',
  categoryId: 'optimization',
  title: { zh: '对角 CMA-ES', en: 'Diagonal CMA-ES' },
  summary: {
    zh: '对角协方差版本的 CMA-ES：每维独立自适应步长，无需完整协方差矩阵。',
    en: 'Diagonal-covariance CMA-ES: per-dimension adaptive step size without a full covariance matrix.',
  },
  description: {
    zh: '对角 CMA-ES：只维护各维方差 σ²·c（对角），用 μ/λ 父代加权更新均值与方差。比完整 CMA-ES 简单且 O(d)。',
    en: 'Diagonal CMA-ES: maintains only per-dimension variances σ²·c (diagonal); updates mean and variance with μ/λ weighted parents. Simpler than full CMA-ES, O(d).',
  },
  tags: ['optimization', 'evolution-strategy', 'cma-es'],
  complexity: { time: 'O(k·λ·d)', space: 'O(d)' },
};
