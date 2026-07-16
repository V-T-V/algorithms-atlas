// He 权重初始化 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-he-init',
  categoryId: 'ml',
  title: { zh: 'He 权重初始化', en: 'He Weight Initialization' },
  summary: { zh: 'ReLU 网络的方差保持初始化。', en: 'Variance-preserving init for ReLU networks.' },
  description: {
    zh: '权重 ~ N(0, 2/fan_in)，避免梯度爆炸或消失。',
    en: 'Weights ~ N(0, 2/fan_in) to stabilize gradients.',
  },
  tags: ['ml', 'initialization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
