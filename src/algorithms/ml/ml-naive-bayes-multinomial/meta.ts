// 多项式朴素贝叶斯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-naive-bayes-multinomial',
  categoryId: 'ml',
  title: { zh: '多项式朴素贝叶斯', en: 'Multinomial Naive Bayes' },
  summary: {
    zh: '用于计数特征（词频）的朴素贝叶斯。',
    en: 'Naive Bayes for count features (word counts).',
  },
  description: {
    zh: '每类估计特征多项式分布概率，预测取最大对数后验。',
    en: 'Estimate per-class multinomial feature probabilities; predict argmax log-posterior.',
  },
  tags: ['ml', 'naive-bayes', 'text'],
  complexity: { time: 'O(nd)', space: 'O(kd)' },
};
