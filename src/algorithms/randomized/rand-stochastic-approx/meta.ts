// 随机近似 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-stochastic-approx',
  categoryId: 'randomized',
  title: { zh: '随机近似', en: 'Stochastic Approximation' },
  summary: {
    zh: 'Robbins-Monro 随机近似求根。',
    en: 'Robbins-Monro stochastic approximation for root finding.',
  },
  description: { zh: 'x_{n+1}=x_n - a_n·(f(x_n)+噪声)。', en: 'x_{n+1}=x_n - a_n·(f(x_n)+noise).' },
  tags: ['randomized', 'optimization'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
