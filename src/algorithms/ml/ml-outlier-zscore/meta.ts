// Z-Score 离群点检测 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-outlier-zscore',
  categoryId: 'ml',
  title: { zh: 'Z-Score 离群点检测', en: 'Z-Score Outlier Detection' },
  summary: { zh: '用 Z-Score 阈值检测离群点。', en: 'Detect outliers via Z-score threshold.' },
  description: {
    zh: '当 |z| > threshold 时视为离群点。',
    en: 'Flag as outlier when |z| > threshold.',
  },
  tags: ['ml', 'anomaly-detection'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
