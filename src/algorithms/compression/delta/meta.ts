// Delta Encoding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'delta',
  categoryId: 'compression',
  title: { zh: '增量编码', en: 'Delta Encoding' },
  summary: {
    zh: '增量编码属于compression类别。',
    en: 'Delta Encoding is a compression algorithm.',
  },
  description: {
    zh: '增量编码（Delta Encoding）属于compression类别的算法。',
    en: 'Delta Encoding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
