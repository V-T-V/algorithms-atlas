// Polyak 动量（Polyak Heavy-Ball Momentum）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-polyak-momentum',
  categoryId: 'optimization',
  title: { zh: 'Polyak 动量', en: 'Polyak Heavy-Ball Momentum' },
  summary: {
    zh: '引入速度累积 v=γv-η∇，加速凸优化收敛。',
    en: 'Accumulate velocity v=γv-η∇ to accelerate convex optimization.',
  },
  description: {
    zh: 'Polyak 重球：v_{t+1}=γ·v_t - η·∇f(x_t)；x_{t+1}=x_t+v_{t+1}。比普通 GD 快。',
    en: 'Polyak heavy-ball: v_{t+1}=γ·v_t-η·∇f(x_t); x_{t+1}=x_t+v_{t+1}. Faster than vanilla GD.',
  },
  tags: ['optimization', 'momentum'],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
