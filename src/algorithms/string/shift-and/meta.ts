// Shift-And Match · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shift-and',
  categoryId: 'string',
  title: { zh: 'Shift-And匹配', en: 'Shift-And Match' },
  summary: {
    zh: 'Shift-And匹配属于string类别。',
    en: 'Shift-And Match is a string algorithm.',
  },
  description: {
    zh: 'Shift-And匹配（Shift-And Match）属于string类别的算法。',
    en: 'Shift-And Match is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n)', space: 'O(|Σ|)' },
};
