// RMSProp · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rmsprop',
  categoryId: 'optimization',
  title: { zh: 'RMSProp', en: 'RMSProp' },
  summary: {
    zh: 'RMSProp属于optimization类别。',
    en: 'RMSProp is a optimization algorithm.',
  },
  description: {
    zh: 'RMSProp（RMSProp）属于optimization类别的算法。',
    en: 'RMSProp is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
