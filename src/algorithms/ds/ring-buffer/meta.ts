// Ring Buffer · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ring-buffer',
  categoryId: 'ds',
  title: { zh: '环形缓冲区', en: 'Ring Buffer' },
  summary: {
    zh: '环形缓冲区属于ds类别。',
    en: 'Ring Buffer is a ds algorithm.',
  },
  description: {
    zh: '环形缓冲区（Ring Buffer）属于ds类别的算法。',
    en: 'Ring Buffer is an algorithm in the ds category.',
  },
  tags: ["ds"],
  complexity: { time: 'O(1) 读 / O(1) 写', space: 'O(capacity)' },
};
