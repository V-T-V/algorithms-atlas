// 增广拉格朗日（Augmented Lagrangian）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-penalty-aug-lag',
  categoryId: 'optimization',
  title: { zh: '增广拉格朗日', en: 'Augmented Lagrangian' },
  summary: {
    zh: '结合拉格朗日乘子与二次罚项，比纯罚函数更稳定。',
    en: 'Combine Lagrange multipliers with a quadratic penalty; more stable than pure penalty.',
  },
  description: {
    zh: 'ALM：L_A=f(x)+λ·c(x)+μ/2·c(x)²。交替更新 x 与乘子 λ←λ+μc(x)。',
    en: 'ALM: L_A=f(x)+λ·c(x)+μ/2·c(x)². Alternate x-update with λ<-λ+μc(x).',
  },
  tags: ['optimization', 'constrained'],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
