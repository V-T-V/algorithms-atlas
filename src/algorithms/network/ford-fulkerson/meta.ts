// Ford-Fulkerson Max Flow · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ford-fulkerson',
  categoryId: 'network',
  title: { zh: '最大流 Ford-Fulkerson', en: 'Ford-Fulkerson Max Flow' },
  summary: {
    zh: '最大流 Ford-Fulkerson属于network类别。',
    en: 'Ford-Fulkerson Max Flow is a network algorithm.',
  },
  description: {
    zh: '最大流 Ford-Fulkerson（Ford-Fulkerson Max Flow）属于network类别的算法。',
    en: 'Ford-Fulkerson Max Flow is an algorithm in the network category.',
  },
  tags: ["network","network-flow"],
  complexity: { time: 'O(V · E²)', space: 'O(V + E)' },
};
