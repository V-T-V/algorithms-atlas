// Z-Score 离群点（Z-Score Outlier）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-zscore',
  categoryId: 'selection',
  title: { zh: 'Z-Score 离群点', en: 'Z-Score Outlier' },
  summary: {
    zh: 'Z-score：|x−μ|/σ 超过阈值视为离群点。',
    en: 'Z-score: |x−μ|/σ beyond a threshold marks an outlier.',
  },
  description: {
    zh: 'Z-score 离群点检测：计算每个点与均值的标准差倍数；超过阈值（如 2 或 3）的视为离群点。',
    en: 'Z-score outlier detection: compute each point standard deviations from the mean; values beyond a threshold (e.g., 2 or 3) are outliers.',
  },
  tags: ['selection', 'statistics', 'zscore', 'outlier'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
