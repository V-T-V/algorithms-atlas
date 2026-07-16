// Wildcard Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'wildcard-match',
  categoryId: 'dp',
  title: { zh: '通配符匹配', en: 'Wildcard Match' },
  summary: {
    zh: '通配符匹配属于dp类别。',
    en: 'Wildcard Match is a dp algorithm.',
  },
  description: {
    zh: '通配符匹配（Wildcard Match）属于dp类别的算法。',
    en: 'Wildcard Match is an algorithm in the dp category.',
  },
  tags: ["dp","bipartite-matching","string-matching"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
