// IQR 离群点检测 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-iqr-outlier',
  categoryId: 'ml',
  title: { zh: 'IQR 离群点检测', en: 'IQR Outlier Detection' },
  summary: { zh: '用四分位距检测离群点。', en: 'Detect outliers via interquartile range.' },
  description: {
    zh: '[Q1-1.5·IQR, Q3+1.5·IQR] 之外为离群点。',
    en: 'Values outside [Q1-1.5·IQR, Q3+1.5·IQR] are outliers.',
  },
  tags: ['ml', 'anomaly-detection'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
