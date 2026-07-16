// 多项分布采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-multinomial',
  categoryId: 'randomized',
  title: { zh: '多项分布采样', en: 'Multinomial Sampling' },
  summary: { zh: '产生多项分布样本计数。', en: 'Sample counts from a multinomial distribution.' },
  description: {
    zh: '依次按条件概率分配 n 次试验。',
    en: 'Allocate n trials by conditional probabilities.',
  },
  tags: ['randomized', 'distribution', 'multinomial'],
  complexity: { time: 'O(n·k)', space: 'O(k)' },
};
