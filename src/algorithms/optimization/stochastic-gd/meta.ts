// Stochastic GD · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stochastic-gd',
  categoryId: 'optimization',
  title: { zh: '随机梯度下降', en: 'Stochastic GD' },
  summary: {
    zh: '随机梯度下降属于optimization类别。',
    en: 'Stochastic GD is a optimization algorithm.',
  },
  description: {
    zh: '随机梯度下降（Stochastic GD）属于optimization类别的算法。',
    en: 'Stochastic GD is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(e·n·d)', space: 'O(d)' },
};
