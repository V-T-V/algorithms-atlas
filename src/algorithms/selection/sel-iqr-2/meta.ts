// 四分位距 v2（Interquartile Range v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-iqr-2',
  categoryId: 'selection',
  title: { zh: '四分位距 v2', en: 'Interquartile Range v2' },
  summary: {
    zh: 'IQR = Q3 − Q1，衡量数据离散程度（稳健）。',
    en: 'IQR = Q3 − Q1, a robust measure of spread.',
  },
  description: {
    zh: '四分位距 IQR 是第 75 百分位与第 25 百分位之差，对离群值稳健，常用于箱线图。',
    en: 'IQR is the difference between the 75th and 25th percentiles; robust to outliers, used in box plots.',
  },
  tags: ['selection', 'statistics', 'iqr', 'robust', 'quartile'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
