// 一维卡尔曼滤波（1D Kalman Filter）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-kalman-1d',
  categoryId: 'optimization',
  title: { zh: '一维卡尔曼滤波', en: '1D Kalman Filter' },
  summary: {
    zh: '递归最小均方估计：预测-更新两步融合带噪观测。',
    en: 'Recursive LMMSE: predict-update steps fuse noisy measurements.',
  },
  description: {
    zh: '卡尔曼：预测 x=x, P=P+Q；更新 K=P/(P+R), x=x+K(z-x), P=(1-K)P。一维简化。',
    en: 'Kalman: predict x=x, P=P+Q; update K=P/(P+R), x=x+K(z-x), P=(1-K)P. 1D simplified.',
  },
  tags: ['optimization', 'filtering', 'estimation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
