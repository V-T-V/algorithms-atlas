// 多项式核 SVM（核感知器） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-svm-kernel',
  categoryId: 'ml',
  title: { zh: '多项式核 SVM（核感知器）', en: 'Polynomial Kernel SVM (Kernel Perceptron)' },
  summary: {
    zh: '用多项式核感知器求解非线性可分问题。',
    en: 'Polynomial kernel perceptron for non-linear separation.',
  },
  description: {
    zh: '维护支持向量集合，预测用 K(x,z)=(x·z+c)^d 核函数加权求和。',
    en: 'Maintains support vectors; prediction via polynomial kernel K(x,z)=(x·z+c)^d.',
  },
  tags: ['ml', 'svm', 'kernel'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
