// Queue (Array) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'queue-array',
  categoryId: 'ds',
  title: { zh: '数组队列', en: 'Queue (Array)' },
  summary: {
    zh: '数组队列属于ds类别。',
    en: 'Queue (Array) is a ds algorithm.',
  },
  description: {
    zh: '数组队列（Queue (Array)）属于ds类别的算法。',
    en: 'Queue (Array) is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(1) 入队 / O(n) 出队', space: 'O(n)' },
};
