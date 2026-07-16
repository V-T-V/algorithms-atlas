// String Match Automaton · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-match-automaton',
  categoryId: 'string',
  title: { zh: '字符串匹配自动机', en: 'String Match Automaton' },
  summary: {
    zh: '字符串匹配自动机属于string类别。',
    en: 'String Match Automaton is a string algorithm.',
  },
  description: {
    zh: '字符串匹配自动机（String Match Automaton）属于string类别的算法。',
    en: 'String Match Automaton is an algorithm in the string category.',
  },
  tags: ["string","bipartite-matching","string-matching"],
  complexity: { time: 'O(n+m·|Σ|)', space: 'O(m·|Σ|)' },
};
