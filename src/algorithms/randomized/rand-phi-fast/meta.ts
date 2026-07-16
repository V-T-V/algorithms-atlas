// Phi 快速随机 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-phi-fast',
  categoryId: 'randomized',
  title: { zh: 'Phi 快速随机生成器', en: 'Phi Fast RNG' },
  summary: {
    zh: '利用黄金比例 φ 的 Weyl 序列做快速浮点伪随机，无乘法。',
    en: 'A Weyl sequence on the golden ratio φ for fast floating-point pseudo-randomness, no multiplications.',
  },
  description: {
    zh: 'Additive recurrence x_{n+1} = (x_n + φ) mod 1（φ=(√5-1)/2）是一种低维 discrepancy 准随机序列（Weyl/黄金比例序列）。实现极简（一次浮点加），速度快但统计独立性弱，适合非关键用途。',
    en: 'Additive recurrence x_{n+1} = (x_n + φ) mod 1 with φ=(√5-1)/2 is a low-discrepancy quasi-random Weyl sequence. Trivial to implement (one float add) and very fast, but weak independence; suitable for non-critical uses.',
  },
  tags: ['randomized', 'prng', 'weyl', 'golden-ratio', 'quasi-random'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
