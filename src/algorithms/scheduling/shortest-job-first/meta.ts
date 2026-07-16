// Shortest Job First · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shortest-job-first',
  categoryId: 'scheduling',
  title: { zh: '最短作业优先', en: 'Shortest Job First' },
  summary: {
    zh: '最短作业优先属于scheduling类别。',
    en: 'Shortest Job First is a scheduling algorithm.',
  },
  description: {
    zh: '最短作业优先（Shortest Job First）属于scheduling类别的算法。',
    en: 'Shortest Job First is an algorithm in the scheduling category.',
  },
  tags: ["scheduling","shortest-path"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
