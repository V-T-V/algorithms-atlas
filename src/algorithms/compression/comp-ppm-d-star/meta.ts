// PPM*d（PPM*d）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-ppm-d-star',
  categoryId: 'compression',
  title: { zh: 'PPM*d', en: 'PPM*d' },
  summary: {
    zh: 'PPM*d：所有阶上下文加权混合，无显式逃逸。',
    en: 'PPM*d: blend all-order contexts, no explicit escape.',
  },
  description: {
    zh: 'PPM*d（Cleary, Teahan）维护所有阶上下文，预测时把各阶概率加权混合，避免显式逃逸，常优于 PPM。',
    en: 'PPM*d (Cleary, Teahan) maintains all-order contexts and blends their probabilities, avoiding explicit escape and often beating PPM.',
  },
  tags: ['compression', 'ppm', 'context', 'blending'],
  complexity: { time: 'O(n·k)', space: 'O(σ^k)' },
};
