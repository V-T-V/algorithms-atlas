// 四分位距 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-iqr',
  categoryId: 'selection',
  title: { zh: '四分位距 (IQR)', en: 'Interquartile Range (IQR)' },
  summary: {
    zh: 'IQR = Q3 - Q1，衡量数据离散度，对离群点稳健。',
    en: 'IQR = Q3 - Q1; a robust measure of spread insensitive to outliers.',
  },
  description: {
    zh: '四分位距 IQR = Q3 - Q1，描述中间 50% 数据的跨度。常用于箱线图和离群点检测（< Q1-1.5·IQR 或 > Q3+1.5·IQR 视为离群）。',
    en: 'The interquartile range IQR = Q3 - Q1 describes the spread of the middle 50% of data. Widely used in box plots and outlier detection (points < Q1-1.5·IQR or > Q3+1.5·IQR are outliers).',
  },
  tags: ['selection', 'iqr', 'statistics', 'robust'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
