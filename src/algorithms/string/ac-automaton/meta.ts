// Aho-Corasick · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ac-automaton',
  categoryId: 'string',
  title: { zh: 'AC 自动机', en: 'Aho-Corasick' },
  summary: {
    zh: 'AC 自动机属于string类别。',
    en: 'Aho-Corasick is a string algorithm.',
  },
  description: {
    zh: 'AC 自动机（Aho-Corasick）属于string类别的算法。',
    en: 'Aho-Corasick is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(|T| + Σ|Pi| + 命中数)', space: 'O(Σ|Pi|)' },
};
