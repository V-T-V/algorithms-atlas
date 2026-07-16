// Russian Doll · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'russian-doll',
  categoryId: 'dp',
  title: { zh: '俄罗斯套娃', en: 'Russian Doll' },
  summary: {
    zh: '俄罗斯套娃属于dp类别。',
    en: 'Russian Doll is a dp algorithm.',
  },
  description: {
    zh: '俄罗斯套娃（Russian Doll）属于dp类别的算法。',
    en: 'Russian Doll is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
