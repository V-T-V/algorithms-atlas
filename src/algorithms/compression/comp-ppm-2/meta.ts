// PPM v2（PPM v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-ppm-2',
  categoryId: 'compression',
  title: { zh: 'PPM v2', en: 'PPM v2' },
  summary: {
    zh: 'PPM：上下文自适应概率 + 回退机制。',
    en: 'PPM: context-adaptive probabilities with backoff.',
  },
  description: {
    zh: 'PPM（Prediction by Partial Matching）用最长 k 阶上下文预测下一符号；若上下文不存在则用「逃逸」概率回退到 k-1 阶。',
    en: 'PPM (Prediction by Partial Matching) predicts the next symbol using the longest order-k context; if absent, an escape probability backs off to order k-1.',
  },
  tags: ['compression', 'ppm', 'context', 'adaptive'],
  complexity: { time: 'O(n·k)', space: 'O(σ^k)' },
};
