// van Emde Boas Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'van-emde-boas',
  categoryId: 'ds',
  title: { zh: 'vEB树', en: 'van Emde Boas Tree' },
  summary: {
    zh: 'vEB树属于ds类别。',
    en: 'van Emde Boas Tree is a ds algorithm.',
  },
  description: {
    zh: 'vEB树（van Emde Boas Tree）属于ds类别的算法。',
    en: 'van Emde Boas Tree is an algorithm in the ds category.',
  },
  tags: ["ds"],
  complexity: { time: 'O(log log U)', space: 'O(U)' },
};
