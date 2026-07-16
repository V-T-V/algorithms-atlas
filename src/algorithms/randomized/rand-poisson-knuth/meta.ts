// 泊松采样（Knuth） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-poisson-knuth',
  categoryId: 'randomized',
  title: { zh: '泊松采样（Knuth）', en: 'Poisson Sampling (Knuth)' },
  summary: {
    zh: 'Knuth 算法产生泊松分布。',
    en: "Generate Poisson samples via Knuth's algorithm.",
  },
  description: { zh: '累乘均匀数直到小于 e^{-λ}。', en: 'Multiply uniforms until below e^{-λ}.' },
  tags: ['randomized', 'distribution', 'poisson'],
  complexity: { time: 'O(λ)', space: 'O(1)' },
};
