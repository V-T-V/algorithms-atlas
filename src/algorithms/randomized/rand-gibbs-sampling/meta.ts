// Gibbs 采样 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-gibbs-sampling',
  categoryId: 'randomized',
  title: { zh: 'Gibbs 采样', en: 'Gibbs Sampling' },
  summary: {
    zh: 'MCMC：每次只沿一个坐标按条件分布采样，无需接受率。',
    en: 'MCMC that samples each coordinate from its conditional; no acceptance ratio needed.',
  },
  description: {
    zh: 'Gibbs 采样适用于多元分布且各维条件分布可解析的情况。每步轮流对每个坐标 x_i 从 p(x_i | x_{-i}) 采样。它是 Metropolis-Hastings 的特例，接受率恒为 1。',
    en: 'Gibbs sampling suits multivariate distributions whose per-coordinate conditionals are tractable. Each step cycles through coordinates, drawing x_i from p(x_i | x_{-i}). It is a special case of Metropolis-Hastings with acceptance 1.',
  },
  tags: ['randomized', 'mcmc', 'gibbs', 'sampling'],
  complexity: { time: 'O(N*D)', space: 'O(N*D)' },
};
