// Momentum GD · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'momentum',
  categoryId: 'optimization',
  title: { zh: '动量梯度下降', en: 'Momentum GD' },
  summary: {
    zh: '动量梯度下降属于optimization类别。',
    en: 'Momentum GD is a optimization algorithm.',
  },
  description: {
    zh: '动量梯度下降（Momentum GD）属于optimization类别的算法。',
    en: 'Momentum GD is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
