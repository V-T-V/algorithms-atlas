// Queue (Linked) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'queue-linked',
  categoryId: 'ds',
  title: { zh: '链式队列', en: 'Queue (Linked)' },
  summary: {
    zh: '链式队列属于ds类别。',
    en: 'Queue (Linked) is a ds algorithm.',
  },
  description: {
    zh: '链式队列（Queue (Linked)）属于ds类别的算法。',
    en: 'Queue (Linked) is an algorithm in the ds category.',
  },
  tags: ["ds","linked-list","data-structure"],
  complexity: { time: 'O(1) 入队 / O(1) 出队', space: 'O(n)' },
};
