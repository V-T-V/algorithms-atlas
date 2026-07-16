// Hamming Distance · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hamming',
  categoryId: 'string',
  title: { zh: '汉明距离', en: 'Hamming Distance' },
  summary: {
    zh: '汉明距离属于string类别。',
    en: 'Hamming Distance is a string algorithm.',
  },
  description: {
    zh: '汉明距离（Hamming Distance）属于string类别的算法。',
    en: 'Hamming Distance is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
