// AdaBound（AdaBound Optimizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-ada-bound',
  categoryId: 'optimization',
  title: { zh: 'AdaBound', en: 'AdaBound Optimizer' },
  summary: {
    zh: '给 Adam 的步长设上下界，初期像 Adam 后期像 SGD。',
    en: 'Bound Adam step sizes between dynamic limits; Adam-like early, SGD-like late.',
  },
  description: {
    zh: 'AdaBound：在 Adam 基础上把 lr 裁剪到 [lower, upper] 动态边界，兼顾自适应与稳定。',
    en: 'AdaBound: clip Adam lr into dynamic [lower, upper]; balances adaptivity and stability.',
  },
  tags: ['optimization', 'adaptive', 'machine-learning'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
