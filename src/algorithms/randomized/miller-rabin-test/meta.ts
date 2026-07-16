// Miller-Rabin 随机化素性测试 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'miller-rabin-test',
  categoryId: 'randomized',
  title: { zh: 'Miller-Rabin 随机化素性测试', en: 'Miller-Rabin Randomized Primality Test' },
  summary: {
    zh: '将 n−1=2^s·d，随机取 a 检查 a^d≡1 或 a^(2^r·d)≡−1 (mod n)，单边错误 ≤ 1/4。',
    en: 'Write n−1=2^s·d, test random a for a^d≡1 or a^(2^r·d)≡−1 (mod n); one-sided error ≤ 1/4 per round.',
  },
  description: {
    zh: 'Miller-Rabin（1976/1980）是工程中最常用的素性测试，兼具高速与高确定性。基于费马小定理的强化形式：对奇数 n>2，令 n−1=2^s·d（d 为奇数）。若 n 为素数，则对任意 a∉{0 mod n}，序列 a^d, a^(2d), …, a^(2^s·d)=a^(n−1) (mod n) 要么第一项就是 1，要么存在某项为 n−1（即 −1）。若找到某个 a 使该条件不成立，n 一定是合数（称 a 为「证据」）。随机取 k 个 a，每个非证据的概率 ≤ 1/4，故合数被误判为素数的概率 ≤ 4^(−k)。本实现使用 BigInt 模乘快速幂，并对 n<2^64 提供确定性基组 {2,3,5,7,11,13,17,19,23,29,31,37}，可给出无误差结论。',
    en: "Miller-Rabin (1976/1980) is the most widely used primality test in practice, combining speed with high confidence. It strengthens Fermat's little theorem: for odd n>2, write n−1=2^s·d (d odd). If n is prime, then for any a not divisible by n, the sequence a^d, a^(2d), …, a^(2^s·d)=a^(n−1) (mod n) is either 1 from the start or contains n−1 (i.e. −1). If some a violates this, n is definitely composite (a is a 'witness'). Randomly picking k bases, each non-witness has probability ≤ 1/4, so a composite is misclassified as prime with probability ≤ 4^(−k). This BigInt implementation uses fast modular exponentiation and, for n<2^64, the deterministic bases {2,3,5,7,11,13,17,19,23,29,31,37} yield a correct answer with no error.",
  },
  tags: ['randomized', 'number-theory', 'primality', 'monte-carlo', 'bigint'],
  complexity: { time: 'O(k·log³n)', space: 'O(1)' },
};
