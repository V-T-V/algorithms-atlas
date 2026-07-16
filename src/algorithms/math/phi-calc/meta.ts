// 单值欧拉函数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'phi-calc',
  categoryId: 'math',
  title: { zh: '单值欧拉函数 φ(n)', en: 'Single-value Euler Totient φ(n)' },
  summary: {
    zh: '用唯一分解定理 O(√n) 计算 φ(n)=n·∏(1−1/p)。',
    en: 'Compute φ(n)=n·∏(1−1/p) in O(√n) via prime factorization.',
  },
  description: {
    zh: '欧拉函数 φ(n) 计数 [1,n] 中与 n 互素的正整数个数。由唯一分解定理，若 n = ∏ p_i^{k_i}，则 φ(n) = n·∏(1 − 1/p_i) = ∏ p_i^{k_i−1}(p_i − 1)。单值计算只需对 n 做试除分解，O(√n)。区别于 phi-sieve / euler-totient 的批量筛法，本算法求单个 n 的 φ，适合 n 很大（如 10^18）的场景。BigInt 实现。',
    en: 'The Euler totient φ(n) counts integers in [1,n] coprime to n. By unique factorization, if n = ∏ p_i^{k_i}, then φ(n) = n·∏(1 − 1/p_i) = ∏ p_i^{k_i−1}(p_i − 1). Single-value computation just trial-divides n in O(√n). Distinct from phi-sieve / euler-totient batch sieves, this computes φ for a single n, suited to very large n (e.g. 10^18). BigInt implementation.',
  },
  tags: ['math', 'number-theory', 'euler-totient'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
