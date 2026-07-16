// Regex Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'regex-match',
  categoryId: 'dp',
  title: { zh: '正则匹配', en: 'Regex Match' },
  summary: {
    zh: '正则匹配属于dp类别。',
    en: 'Regex Match is a dp algorithm.',
  },
  description: {
    zh: '正则匹配（Regex Match）属于dp类别的算法。',
    en: 'Regex Match is an algorithm in the dp category.',
  },
  tags: ["dp","bipartite-matching","string-matching"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
