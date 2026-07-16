// Catalan Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'catalan',
  categoryId: 'math',
  title: { zh: '卡特兰数', en: 'Catalan Number' },
  summary: {
    zh: '卡特兰数属于math类别。',
    en: 'Catalan Number is a math algorithm.',
  },
  description: {
    zh: '卡特兰数（Catalan Number）属于math类别的算法。',
    en: 'Catalan Number is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
