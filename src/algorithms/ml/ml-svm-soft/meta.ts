// 软间隔 SVM（Pegasos） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-svm-soft',
  categoryId: 'ml',
  title: { zh: '软间隔 SVM（Pegasos）', en: 'Soft-Margin SVM (Pegasos)' },
  summary: {
    zh: '用 Pegasos（原始型随机次梯度）求解 L2 正则化软间隔线性 SVM。',
    en: 'Solve L2-regularized soft-margin linear SVM via Pegasos (primal stochastic subgradient).',
  },
  description: {
    zh: 'Pegasos 求解原始问题 min (λ/2)|w|² + (1/n)Σ max(0,1-y_i<w,x_i>)，每步随机选样本更新，收敛率 O(1/T)。',
    en: 'Pegasos solves the primal SVM objective with stochastic subgradient; O(1/T) convergence.',
  },
  tags: ['ml', 'svm', 'pegasos', 'online-learning'],
  complexity: { time: 'O(Td)', space: 'O(d)' },
};
