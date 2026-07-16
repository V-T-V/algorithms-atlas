// 离群点检测（Outlier Detection (Tukey)）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-outlier-detect',
  categoryId: 'selection',
  title: { zh: '离群点检测', en: 'Outlier Detection (Tukey)' },
  summary: {
    zh: 'Tukey 离群点：超出 [Q1−1.5·IQR, Q3+1.5·IQR]。',
    en: 'Tukey outliers: values outside [Q1−1.5·IQR, Q3+1.5·IQR].',
  },
  description: {
    zh: 'Tukey 离群点检测：用 IQR 定义栅栏，超出 Q1−1.5·IQR 或 Q3+1.5·IQR 的点为离群点。',
    en: 'Tukey outlier detection: uses IQR fences; points below Q1−1.5·IQR or above Q3+1.5·IQR are outliers.',
  },
  tags: ['selection', 'statistics', 'outlier', 'iqr', 'robust'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
