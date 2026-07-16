// Shift-Or Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shift-or',
  categoryId: 'string',
  title: { zh: 'Shift-Or匹配', en: 'Shift-Or Match' },
  summary: {
    zh: 'Shift-Or匹配属于string类别。',
    en: 'Shift-Or Match is a string algorithm.',
  },
  description: {
    zh: 'Shift-Or匹配（Shift-Or Match）属于string类别的算法。',
    en: 'Shift-Or Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(|Σ|)' },
};
