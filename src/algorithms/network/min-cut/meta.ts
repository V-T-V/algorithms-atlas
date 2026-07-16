// Min Cut · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-cut',
  categoryId: 'network',
  title: { zh: '最小割', en: 'Min Cut' },
  summary: {
    zh: '最小割属于network类别。',
    en: 'Min Cut is a network algorithm.',
  },
  description: {
    zh: '最小割（Min Cut）属于network类别的算法。',
    en: 'Min Cut is an algorithm in the network category.',
  },
  tags: ["network","graph-connectivity"],
  complexity: { time: 'O(n^3)', space: 'O(n^2)' },
};
