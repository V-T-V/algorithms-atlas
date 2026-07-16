// Queue Reconstruction · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'queue-recon',
  categoryId: 'greedy',
  title: { zh: '队列重建', en: 'Queue Reconstruction' },
  summary: {
    zh: '队列重建属于greedy类别。',
    en: 'Queue Reconstruction is a greedy algorithm.',
  },
  description: {
    zh: '队列重建（Queue Reconstruction）属于greedy类别的算法。',
    en: 'Queue Reconstruction is an algorithm in the greedy category.',
  },
  tags: ["greedy","data-structure"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
