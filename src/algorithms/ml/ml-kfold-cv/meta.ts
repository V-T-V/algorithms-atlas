// K 折交叉验证索引 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-kfold-cv',
  categoryId: 'ml',
  title: { zh: 'K 折交叉验证索引', en: 'K-Fold CV Indices' },
  summary: {
    zh: '生成 K 折交叉验证的训练/测试索引。',
    en: 'Generate train/test index splits for K-fold CV.',
  },
  description: {
    zh: '把 n 个样本分成 K 折，每次取一折为测试。',
    en: 'Split n samples into K folds; each fold serves as test once.',
  },
  tags: ['ml', 'evaluation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
