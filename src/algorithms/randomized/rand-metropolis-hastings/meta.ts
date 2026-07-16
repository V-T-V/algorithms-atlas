// Metropolis-Hastings 采样 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-metropolis-hastings',
  categoryId: 'randomized',
  title: { zh: 'Metropolis-Hastings 采样', en: 'Metropolis-Hastings Sampling' },
  summary: {
    zh: 'MCMC：按接受率 min(1, p(x′)/p(x)) 采目标分布 p 的样本。',
    en: "MCMC: accept a proposal with probability min(1, p(x')/p(x)) to sample from target p.",
  },
  description: {
    zh: "Metropolis-Hastings 是最通用的 MCMC 算法：给定目标密度 p(x)（仅需正比）与对称建议分布 q，每步从当前 x 提出 x'~q(·|x)，以 α=min(1, p(x')q(x|x')/(p(x)q(x'|x))) 接受。对称 q 时简化为 min(1, p(x')/p(x))。",
    en: "Metropolis-Hastings is the most general MCMC method: given a target density p(x) (only up to proportionality) and a symmetric proposal q, each step proposes x'~q(·|x) and accepts with α=min(1, p(x')q(x|x')/(p(x)q(x'|x))). For symmetric q this simplifies to min(1, p(x')/p(x)).",
  },
  tags: ['randomized', 'mcmc', 'metropolis-hastings', 'sampling'],
  complexity: { time: 'O(N)', space: 'O(N)' },
};
