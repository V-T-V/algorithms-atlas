// 加权平均集成 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-weighted-average',
  categoryId: 'ml',
  title: { zh: '加权平均集成', en: 'Weighted Average Ensemble' },
  summary: { zh: '按权重组合多个模型预测。', en: 'Combine model predictions by weights.' },
  description: {
    zh: '最终预测 = Σwᵢ ŷᵢ，权重归一化。',
    en: 'Final = Σwᵢ ŷᵢ with normalized weights.',
  },
  tags: ['ml', 'ensemble'],
  complexity: { time: 'O(m)', space: 'O(1)' },
};
