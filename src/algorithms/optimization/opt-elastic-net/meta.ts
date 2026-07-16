// 弹性网正则（Elastic Net Regularization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-elastic-net',
  categoryId: 'optimization',
  title: { zh: '弹性网正则', en: 'Elastic Net Regularization' },
  summary: {
    zh: 'L1+L2 混合正则，兼顾稀疏与稳定，用于特征选择。',
    en: 'L1+L2 mixed penalty for sparsity plus stability; used in feature selection.',
  },
  description: {
    zh: '弹性网：min ½||Xw-y||² + λ(α|w|_1 + ½(1-α)||w||²)。坐标下降求解。',
    en: 'Elastic net: min ½||Xw-y||² + λ(α|w|_1+½(1-α)||w||²). Solved by coordinate descent.',
  },
  tags: ['optimization', 'regularization', 'machine-learning'],
  complexity: { time: 'O(k·n·d)', space: 'O(d)' },
};
