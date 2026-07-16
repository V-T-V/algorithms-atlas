// 伯努利朴素贝叶斯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-naive-bayes-bernoulli',
  categoryId: 'ml',
  title: { zh: '伯努利朴素贝叶斯', en: 'Bernoulli Naive Bayes' },
  summary: {
    zh: '用于二值特征的朴素贝叶斯（文本分类）。',
    en: 'Naive Bayes for binary features (text classification).',
  },
  description: {
    zh: '每类每特征估计出现概率，预测取最大对数后验。',
    en: 'Estimate per-class feature presence probabilities; predict argmax log-posterior.',
  },
  tags: ['ml', 'naive-bayes', 'text'],
  complexity: { time: 'O(nd)', space: 'O(kd)' },
};
