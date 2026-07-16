// Pollard Rho 随机化因数分解 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pollard-rho-factor',
  categoryId: 'randomized',
  title: { zh: 'Pollard Rho 随机化因数分解', en: 'Pollard Rho Randomized Factorization' },
  summary: {
    zh: '用伪随机序列 x→x²+c (mod n) + Floyd 环检测找非平凡因子，期望 O(√p) 找到最小素因子 p。',
    en: 'Use pseudo-random walk x→x²+c (mod n) with Floyd cycle detection to find a non-trivial factor in expected O(√p) for smallest prime p.',
  },
  description: {
    zh: 'Pollard Rho（1975）是分解中等大小合数的经典随机化算法，比试除法快得多。核心思想：构造伪随机序列 x₀=2, x_{k+1} = x_k² + c (mod n)，由于值域有限，序列最终会进入循环（形状像希腊字母 ρ：一条尾巴接一个环）。对每个步计算 g = gcd(|x_i − x_{2i}|, n)（用 Floyd 快慢指针成倍加速）：若 1<g<n 则找到非平凡因子 g；若 g=n 则换一个常数 c 重来。生日悖论表明，序列在模 p 意义下期望 O(√p) 步碰撞，而 p 是 n 的最小素因子，故复杂度约 O(n^(1/4))。配合 Miller-Rabin 终止条件可完整分解大整数。本实现用 BigInt，递归分解并收集全部素因子。',
    en: "Pollard Rho (1975) is the classic randomized algorithm for factoring moderate-sized composites, far faster than trial division. The idea: build a pseudo-random sequence x₀=2, x_{k+1}=x_k²+c (mod n); since the range is finite the sequence eventually cycles (shaped like the Greek letter ρ: a tail into a loop). For each step compute g=gcd(|x_i−x_{2i}|, n) using Floyd's tortoise-and-hare doubling to speed things up: if 1<g<n we found a non-trivial factor g; if g=n, restart with a different constant c. The birthday paradox shows the sequence collides modulo p in expected O(√p) steps, where p is the smallest prime factor of n, giving overall complexity about O(n^(1/4)). Combined with Miller-Rabin as the termination test, one can fully factor large integers. This BigInt implementation recurses to collect all prime factors.",
  },
  tags: ["randomized"],
  complexity: { time: 'O(n^(1/4))', space: 'O(log n)' },
};
