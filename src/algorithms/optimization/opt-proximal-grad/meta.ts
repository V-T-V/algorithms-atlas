// 近端梯度（Proximal Gradient）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-proximal-grad',
  categoryId: 'optimization',
  title: { zh: '近端梯度', en: 'Proximal Gradient' },
  summary: {
    zh: '对可分 f+g 用梯度步处理 f、近端算子处理 g（如软阈值）。',
    en: 'For separable f+g use a gradient step on f and a proximal operator on g (e.g. soft threshold).',
  },
  description: {
    zh: '近端梯度：x←prox_{ηg}(x-η∇f)。软阈值 prox 是 Lasso 的核心。',
    en: 'Proximal gradient: x<-prox_{ηg}(x-η∇f). Soft-thresholding prox is core to Lasso.',
  },
  tags: ['optimization', 'proximal'],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
