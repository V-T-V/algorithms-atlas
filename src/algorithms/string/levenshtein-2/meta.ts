// Levenshtein (Full Matrix) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'levenshtein-2',
  categoryId: 'string',
  title: { zh: '莱文斯坦距离（全矩阵）', en: 'Levenshtein (Full Matrix)' },
  summary: {
    zh: '莱文斯坦距离（全矩阵）属于string类别。',
    en: 'Levenshtein (Full Matrix) is a string algorithm.',
  },
  description: {
    zh: '莱文斯坦距离（全矩阵）（Levenshtein (Full Matrix)）属于string类别的算法。',
    en: 'Levenshtein (Full Matrix) is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};
