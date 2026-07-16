// 中位数填充缺失值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-median-impute',
  categoryId: 'ml',
  title: { zh: '中位数填充缺失值', en: 'Median Imputation' },
  summary: { zh: '用中位数填充缺失值。', en: 'Fill missing values with the median.' },
  description: {
    zh: '对数值特征用中位数填充 null，对离群值鲁棒。',
    en: 'For numeric features, fill null with median; robust to outliers.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
