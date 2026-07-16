// Euler Path (Hierholzer) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-path',
  categoryId: 'graph',
  title: { zh: '欧拉路径（Hierholzer）', en: 'Euler Path (Hierholzer)' },
  summary: {
    zh: '欧拉路径（Hierholzer）属于graph类别。',
    en: 'Euler Path (Hierholzer) is a graph algorithm.',
  },
  description: {
    zh: '欧拉路径（Hierholzer）（Euler Path (Hierholzer)）属于graph类别的算法。',
    en: 'Euler Path (Hierholzer) is an algorithm in the graph category.',
  },
  tags: ["graph","numerical-method"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
