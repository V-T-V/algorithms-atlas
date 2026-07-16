// Primitive Root · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'primitive-root',
  categoryId: 'math',
  title: { zh: '原根', en: 'Primitive Root' },
  summary: {
    zh: '原根属于math类别。',
    en: 'Primitive Root is a math algorithm.',
  },
  description: {
    zh: '原根（Primitive Root）属于math类别的算法。',
    en: 'Primitive Root is an algorithm in the math category.',
  },
  tags: ["math","mst","greedy"],
  complexity: { time: 'O(p · log²p) worst, fast in practice', space: 'O(√p)' },
};
