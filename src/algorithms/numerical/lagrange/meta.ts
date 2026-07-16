// Lagrange Interpolation · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lagrange',
  categoryId: 'numerical',
  title: { zh: '拉格朗日插值', en: 'Lagrange Interpolation' },
  summary: {
    zh: '拉格朗日插值属于numerical类别。',
    en: 'Lagrange Interpolation is a numerical algorithm.',
  },
  description: {
    zh: '拉格朗日插值（Lagrange Interpolation）属于numerical类别的算法。',
    en: 'Lagrange Interpolation is an algorithm in the numerical category.',
  },
  tags: ["numerical","numerical-method"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
