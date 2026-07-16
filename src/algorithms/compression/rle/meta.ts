// Run-Length Encoding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rle',
  categoryId: 'compression',
  title: { zh: '游程编码', en: 'Run-Length Encoding' },
  summary: {
    zh: '游程编码属于compression类别。',
    en: 'Run-Length Encoding is a compression algorithm.',
  },
  description: {
    zh: '游程编码（Run-Length Encoding）属于compression类别的算法。',
    en: 'Run-Length Encoding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
