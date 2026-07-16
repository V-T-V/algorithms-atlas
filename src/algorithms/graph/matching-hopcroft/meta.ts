// Hopcroft-Karp · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'matching-hopcroft',
  categoryId: 'graph',
  title: { zh: 'Hopcroft-Karp 匹配', en: 'Hopcroft-Karp' },
  summary: {
    zh: 'Hopcroft-Karp 匹配属于graph类别。',
    en: 'Hopcroft-Karp is a graph algorithm.',
  },
  description: {
    zh: 'Hopcroft-Karp 匹配（Hopcroft-Karp）属于graph类别的算法。',
    en: 'Hopcroft-Karp is an algorithm in the graph category.',
  },
  tags: ["graph","bipartite-matching","string-matching"],
  complexity: { time: 'O(E·√V)', space: 'O(V + E)' },
};
