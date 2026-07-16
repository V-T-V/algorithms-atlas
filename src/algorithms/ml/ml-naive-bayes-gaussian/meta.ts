// 高斯朴素贝叶斯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-naive-bayes-gaussian',
  categoryId: 'ml',
  title: { zh: '高斯朴素贝叶斯', en: 'Gaussian Naive Bayes' },
  summary: {
    zh: '假设特征条件独立且服从高斯分布的分类器。',
    en: 'Classifier assuming conditionally-independent Gaussian features.',
  },
  description: {
    zh: '对每类估计均值与方差，预测取最大后验概率。',
    en: 'Estimate per-class mean/variance; predict argmax posterior.',
  },
  tags: ['ml', 'naive-bayes', 'classification'],
  complexity: { time: 'O(nd)', space: 'O(kd)' },
};
