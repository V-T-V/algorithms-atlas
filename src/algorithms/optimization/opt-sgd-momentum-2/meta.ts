// SGD+Momentum · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-sgd-momentum-2',
  categoryId: 'optimization',
  title: { zh: 'SGD+Momentum', en: 'SGD with Momentum' },
  summary: {
    zh: '随机梯度下降加动量：累积历史梯度方向加速收敛。',
    en: 'SGD with momentum: accumulate historical gradient to accelerate convergence.',
  },
  description: {
    zh: 'SGD+Momentum：v ← β·v + g；θ ← θ − lr·v。在狭长山谷比纯 SGD 快数倍。',
    en: 'SGD+Momentum: v ← β·v + g; θ ← θ − lr·v. Several times faster than vanilla SGD in narrow valleys.',
  },
  tags: ['optimization', 'sgd', 'momentum'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
