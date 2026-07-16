// 交叉熵损失 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-cross-entropy',
  categoryId: 'ml',
  title: { zh: '交叉熵损失', en: 'Cross-Entropy Loss' },
  summary: { zh: '分类损失：-Σ yᵢ log(pᵢ)。', en: 'Classification loss: -Σ yᵢ log(pᵢ).' },
  description: {
    zh: '真实分布 y 与预测分布 p 的交叉熵。',
    en: 'Cross entropy between true y and predicted p.',
  },
  tags: ['ml', 'loss'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
