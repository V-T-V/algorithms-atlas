// 多分类 SVM（One-vs-Rest） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-svm-multiclass',
  categoryId: 'ml',
  title: { zh: '多分类 SVM（One-vs-Rest）', en: 'Multiclass SVM (One-vs-Rest)' },
  summary: {
    zh: '用多个二分类 SVM 组合实现多分类。',
    en: 'Combine binary SVMs (one-vs-rest) for multiclass.',
  },
  description: {
    zh: '为每个类训练一个 +1/-1 的二分类器，预测取决策值最大者。',
    en: 'Train a +1/-1 binary SVM per class; predict the class with the max decision value.',
  },
  tags: ['ml', 'svm', 'multiclass'],
  complexity: { time: 'O(k·T·d)', space: 'O(k·d)' },
};
