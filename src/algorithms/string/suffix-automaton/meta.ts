// Suffix Automaton · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-automaton',
  categoryId: 'string',
  title: { zh: '后缀自动机', en: 'Suffix Automaton' },
  summary: {
    zh: '后缀自动机属于string类别。',
    en: 'Suffix Automaton is a string algorithm.',
  },
  description: {
    zh: '后缀自动机（Suffix Automaton）属于string类别的算法。',
    en: 'Suffix Automaton is an algorithm in the string category.',
  },
  tags: ["string","suffix-structure"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
