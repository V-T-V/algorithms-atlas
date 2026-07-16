// Rabin-Karp · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rabin-karp',
  categoryId: 'string',
  title: { zh: 'Rabin-Karp 匹配', en: 'Rabin-Karp' },
  summary: {
    zh: 'Rabin-Karp 匹配属于string类别。',
    en: 'Rabin-Karp is a string algorithm.',
  },
  description: {
    zh: 'Rabin-Karp 匹配（Rabin-Karp）属于string类别的算法。',
    en: 'Rabin-Karp is an algorithm in the string category.',
  },
  tags: ["string","string-matching"],
  complexity: { time: 'O(n + m)', space: 'O(1)' },
};
