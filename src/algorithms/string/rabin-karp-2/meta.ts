// Rabin-Karp 2D · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rabin-karp-2',
  categoryId: 'string',
  title: { zh: 'RK二维', en: 'Rabin-Karp 2D' },
  summary: {
    zh: 'RK二维属于string类别。',
    en: 'Rabin-Karp 2D is a string algorithm.',
  },
  description: {
    zh: 'RK二维（Rabin-Karp 2D）属于string类别的算法。',
    en: 'Rabin-Karp 2D is an algorithm in the string category.',
  },
  tags: ["string","string-matching"],
  complexity: { time: 'O(R·C) avg', space: 'O(R·C)' },
};
