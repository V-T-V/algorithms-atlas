// Schwartz-Zippel 多项式恒等测试 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'schwartz-zippel',
  categoryId: 'randomized',
  title: {
    zh: 'Schwartz-Zippel 多项式恒等测试',
    en: 'Schwartz-Zippel Polynomial Identity Testing',
  },
  summary: {
    zh: '随机取值检验 P(x₁,…,xₙ)=0：非零多项式在有限域 S 上随机取值恰为 0 的概率 ≤ d/|S|。',
    en: 'Randomized identity testing: a non-zero polynomial evaluates to 0 at a random point with probability ≤ d/|S|.',
  },
  description: {
    zh: 'Schwartz-Zippel 引理（1979/1979）是随机化算法的基石之一：对一个总次数 ≤ d 的非零多元多项式 P(x₁,…,xₙ)，从有限集合 S 中独立均匀随机取每个变量的取值，则 P 在该点恰为 0 的概率不超过 d/|S|。由此可在 O(n·d)（多项式求值）时间内检验恒等式 P≡Q：令 R=P−Q，随机取一组点求值，若 R≠0 则几乎必得非零；若得 0 则大概率 P≡Q。重复 k 次错误概率降到 (d/|S|)^k。它被广泛用于矩阵乘法验证、密钥匹配、并行随机化算法。本实现用大整数（避免模运算）以系数表表示多项式，演示一元情形与多元乘积式两种用法。',
    en: 'The Schwartz-Zippel lemma (1979) is a cornerstone of randomized algorithms: for a non-zero multivariate polynomial P(x₁,…,xₙ) of total degree ≤ d, if each variable is drawn independently and uniformly from a finite set S, then P evaluates to 0 at that point with probability at most d/|S|. Hence one can test the identity P≡Q in O(n·d) (evaluation) time: set R=P−Q, evaluate at a random point; if R≠0 it is almost surely non-zero, while a zero result means P≡Q with high probability. Repeating k times drives the error down to (d/|S|)^k. It underlies matrix-product verification, fingerprint matching, and parallel randomized algorithms. This implementation uses big integers (no modular arithmetic) and demonstrates both the univariate and multivariate product-polynomial cases.',
  },
  tags: ["randomized"],
  complexity: { time: 'O(k·n·d)', space: 'O(n)' },
};
