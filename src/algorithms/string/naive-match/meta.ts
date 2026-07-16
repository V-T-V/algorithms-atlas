// Naive String Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'naive-match',
  categoryId: 'string',
  title: { zh: '朴素匹配', en: 'Naive String Match' },
  summary: {
    zh: '朴素匹配属于string类别。',
    en: 'Naive String Match is a string algorithm.',
  },
  description: {
    zh: '朴素匹配（Naive String Match）属于string类别的算法。',
    en: 'Naive String Match is an algorithm in the string category.',
  },
  tags: ["string","bipartite-matching","string-matching"],
  complexity: { time: 'O(n·m)', space: 'O(1)' },
};
