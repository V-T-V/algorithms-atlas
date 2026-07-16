// Run-Length Encoding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'run-length',
  categoryId: 'string',
  title: { zh: '游程编码', en: 'Run-Length Encoding' },
  summary: {
    zh: '游程编码属于string类别。',
    en: 'Run-Length Encoding is a string algorithm.',
  },
  description: {
    zh: '游程编码（Run-Length Encoding）属于string类别的算法。',
    en: 'Run-Length Encoding is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
