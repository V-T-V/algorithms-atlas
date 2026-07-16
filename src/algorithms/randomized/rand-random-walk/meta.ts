// 随机游走 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-random-walk',
  categoryId: 'randomized',
  title: { zh: '一维随机游走', en: '1D Random Walk' },
  summary: {
    zh: '每步等概率向左/右走一格，演示扩散与回归性质。',
    en: 'Each step moves left or right with equal probability; illustrates diffusion and recurrence.',
  },
  description: {
    zh: '一维简单随机游走：S_0=0，S_{t+1}=S_t ± 1（各 1/2）。期望 0、方差 t。一维与二维游走是常返的（几乎必然回到原点）。本实现允许设定步数与种子。',
    en: 'The 1D simple random walk: S_0=0, S_{t+1}=S_t ± 1 with equal probability. Mean 0, variance t. Walks in 1D and 2D are recurrent (return to the origin almost surely). This implementation takes a step count and seed.',
  },
  tags: ['randomized', 'random-walk', 'stochastic-process'],
  complexity: { time: 'O(N)', space: 'O(N)' },
};
