// 伯努利采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-bernoulli',
  categoryId: 'randomized',
  title: { zh: '伯努利采样', en: 'Bernoulli Sampling' },
  summary: { zh: '依概率 p 采样 0/1。', en: 'Sample 0/1 with probability p.' },
  description: { zh: 'uniform < p 即成功。', en: 'Success if uniform < p.' },
  tags: ['randomized', 'distribution'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
