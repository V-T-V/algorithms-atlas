// 2-SAT · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'two-sat',
  categoryId: 'graph',
  title: { zh: '2-SAT', en: '2-SAT' },
  summary: {
    zh: '2-SAT属于graph类别。',
    en: '2-SAT is a graph algorithm.',
  },
  description: {
    zh: '2-SAT（2-SAT）属于graph类别的算法。',
    en: '2-SAT is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(n + m)', space: 'O(n + m)' },
};
