// Linear Regression (OLS) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linear-regression',
  categoryId: 'ml',
  title: { zh: '线性回归（最小二乘）', en: 'Linear Regression (OLS)' },
  summary: {
    zh: '线性回归（最小二乘）属于ml类别。',
    en: 'Linear Regression (OLS) is a ml algorithm.',
  },
  description: {
    zh: '线性回归（最小二乘）（Linear Regression (OLS)）属于ml类别的算法。',
    en: 'Linear Regression (OLS) is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
