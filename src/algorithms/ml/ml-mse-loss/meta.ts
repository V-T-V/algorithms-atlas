// 均方误差 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-mse-loss',
  categoryId: 'ml',
  title: { zh: '均方误差', en: 'Mean Squared Error' },
  summary: { zh: '回归损失：Σ(y-ŷ)²/n。', en: 'Regression loss: Σ(y-ŷ)²/n.' },
  description: {
    zh: 'MSE 对大误差敏感，常用作回归目标函数。',
    en: 'MSE penalizes large errors; standard regression objective.',
  },
  tags: ['ml', 'loss', 'regression'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
