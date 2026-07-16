// Euclidean Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euclidean-distance',
  categoryId: 'misc',
  title: { zh: '欧氏距离', en: 'Euclidean Distance' },
  summary: {
    zh: '欧氏距离属于misc类别。',
    en: 'Euclidean Distance is a misc algorithm.',
  },
  description: {
    zh: '欧氏距离（Euclidean Distance）属于misc类别的算法。',
    en: 'Euclidean Distance is an algorithm in the misc category.',
  },
  tags: ["misc"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
