// 莫比乌斯反演 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'moebius-inversion',
  categoryId: 'math',
  title: { zh: '莫比乌斯反演（应用）', en: 'Möbius Inversion (Application)' },
  summary: {
    zh: '应用 μ 反演从 g(n)=Σ_{d|n} f(d) 恢复 f(n)=Σ_{d|n} μ(d)g(n/d)。',
    en: 'Apply μ to recover f from g(n)=Σ_{d|n} f(d) via f(n)=Σ_{d|n} μ(d)g(n/d).',
  },
  description: {
    zh: '莫比乌斯反演：若 g(n) = Σ_{d|n} f(d)，则 f(n) = Σ_{d|n} μ(d)·g(n/d)。本实现演示经典应用——从「n 的约数个数和」反推恒等函数：设 g(n)=Σ_{d|n} d（约数和 σ(n)），则 f(n) = Σ μ(d)·σ(n/d) = n（恒等函数）。提供线性筛 μ 与反演求和两个工具。区别于已有的 mobius-inversion（仅构造 μ 表），本算法聚焦反演公式的应用。',
    en: 'Möbius inversion: if g(n) = Σ_{d|n} f(d), then f(n) = Σ_{d|n} μ(d)·g(n/d). This implementation demonstrates a classic application — recovering the identity function from the divisor-sum: let g(n)=Σ_{d|n} d (σ(n)), then f(n) = Σ μ(d)·σ(n/d) = n (identity). Provides both the linear μ sieve and the inversion summation. Distinct from the existing mobius-inversion (which only builds the μ table) by focusing on applying the inversion formula.',
  },
  tags: ['math', 'number-theory', 'mobius', 'inversion'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
