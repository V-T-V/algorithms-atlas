// 平均随机梯度（Averaged Stochastic Gradient）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-averaging-sgd',
  categoryId: 'optimization',
  title: { zh: '平均随机梯度', en: 'Averaged Stochastic Gradient' },
  summary: {
    zh: 'SGD 中维护参数滑动平均作为最终输出，降低方差。',
    en: 'Maintain a running average of SGD iterates as the final output to reduce variance.',
  },
  description: {
    zh: 'ASGD：θ_{t+1}=θ_t-η·g_t；barθ_t=barθ_{t-1}+1/t·(θ_t-barθ_{t-1})。返回 barθ。',
    en: 'ASGD: θ_{t+1}=θ_t-η·g_t; barθ_t averages iterates. Return barθ.',
  },
  tags: ['optimization', 'stochastic'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
