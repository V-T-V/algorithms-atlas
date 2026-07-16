// 狄利克雷卷积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dirichlet-convolution',
  categoryId: 'math',
  title: { zh: '狄利克雷卷积', en: 'Dirichlet Convolution' },
  summary: {
    zh: '计算两个数论函数的狄利克雷卷积 (f*g)(n)=Σ_{d|n} f(d)g(n/d)，O(n log n)。',
    en: 'Compute the Dirichlet convolution (f*g)(n)=Σ_{d|n} f(d)g(n/d) in O(n log n).',
  },
  description: {
    zh: '数论函数 f 与 g 的狄利克雷卷积定义为 (f*g)(n) = Σ_{d|n} f(d)·g(n/d)。许多重要关系是其特例：φ * 1 = N（恒等函数），μ * 1 = ε（仅在 n=1 为 1），σ = 1 * 1（约数和）。实现用「按倍数」枚举：对每个 d，把 f(d)·g(k) 累加到结果[d·k]，时间 O(n log n)。',
    en: 'The Dirichlet convolution of arithmetic functions f and g is (f*g)(n) = Σ_{d|n} f(d)·g(n/d). Many key identities are instances: φ * 1 = N, μ * 1 = ε (identity at 1), σ = 1 * 1. Implemented by a "by multiples" enumeration: for each d add f(d)·g(k) into result[d·k], in O(n log n).',
  },
  tags: ['math', 'number-theory', 'dirichlet', 'convolution'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
