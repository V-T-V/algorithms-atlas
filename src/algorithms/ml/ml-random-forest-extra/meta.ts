// Extra Trees（极随机树） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-random-forest-extra',
  categoryId: 'ml',
  title: { zh: 'Extra Trees（极随机树）', en: 'Extremely Randomized Trees' },
  summary: { zh: '分裂阈值随机的集成树。', en: 'Ensemble trees with random split thresholds.' },
  description: {
    zh: 'Extra Trees 在每个候选特征上随机选阈值（而非最优），降低方差、加速训练。',
    en: 'Extra Trees picks random thresholds per feature (not optimal), reducing variance and speeding training.',
  },
  tags: ['ml', 'random-forest', 'ensemble'],
  complexity: { time: 'O(M·n·d)', space: 'O(M·d)' },
};
