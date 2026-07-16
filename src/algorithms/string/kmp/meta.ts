// KMP Pattern Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kmp',
  categoryId: 'string',
  title: { zh: 'KMP 模式匹配', en: 'KMP Pattern Match' },
  summary: {
    zh: 'KMP 模式匹配属于string类别。',
    en: 'KMP Pattern Match is a string algorithm.',
  },
  description: {
    zh: 'KMP 模式匹配（KMP Pattern Match）属于string类别的算法。',
    en: 'KMP Pattern Match is an algorithm in the string category.',
  },
  tags: ["string","string-matching"],
  complexity: { time: 'O(n + m)', space: 'O(m)' },
};
