// 众数填充缺失值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-mode-impute',
  categoryId: 'ml',
  title: { zh: '众数填充缺失值', en: 'Mode Imputation' },
  summary: { zh: '用众数填充缺失值。', en: 'Fill missing values with the mode.' },
  description: {
    zh: '对分类特征用出现次数最多的值填充 null。',
    en: 'For categorical features, fill null with the most frequent value.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
