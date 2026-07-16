// Chinese Postman · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chinese-stamp',
  categoryId: 'math',
  title: { zh: '中国邮路', en: 'Chinese Postman' },
  summary: {
    zh: '中国邮路属于math类别。',
    en: 'Chinese Postman is a math algorithm.',
  },
  description: {
    zh: '中国邮路（Chinese Postman）属于math类别的算法。',
    en: 'Chinese Postman is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(V³ + E)', space: 'O(V² + E)' },
};
