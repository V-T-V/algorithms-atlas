import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'babystep-giantstep',
  categoryId: 'math',
  title: { zh: '小步大步算法', en: 'Baby-Step Giant-Step' },
  summary: {
    zh: '求离散对数 a^x ≡ b (mod p)：O(√p) 时空的 Meet-in-the-Middle。',
    en: 'Solve discrete log a^x ≡ b (mod p) in O(√p) time/space via meet-in-the-middle.',
  },
  description: {
    zh: '小步大步算法（BSGS）求离散对数：给定 a、b 与素数 p（gcd(a,p)=1），求最小非负整数 x 使 a^x ≡ b (mod p)。令 m=⌈√p⌉，把 x 写成 i·m+j。先「小步」预计算并哈希 a^j mod p（j=0..m-1）；再「大步」对每个 i=0..m 计算 γ=b·(a^{-m})^i mod p，在哈希中查找，命中则 x=i·m+j。本质是 Meet-in-the-Middle，把朴素 O(p) 降到 O(√p)。返回最小解或 null。',
    en: 'The Baby-Step Giant-Step (BSGS) algorithm computes the discrete logarithm: given a, b, and prime p (gcd(a,p)=1), find the smallest non-negative x with a^x ≡ b (mod p). Let m=ceil(sqrt(p)) and write x=i*m+j. "Baby steps" hash a^j for j=0..m-1; "giant steps" compute b*(a^-m)^i for i=0..m and look it up; a hit gives x=i*m+j. This meet-in-the-middle reduces naive O(p) to O(sqrt p). Returns the smallest solution or null.',
  },
  tags: ['math', 'number-theory', 'discrete-log', 'bsgs', 'meet-in-the-middle'],
  complexity: { time: 'O(√p)', space: 'O(√p)' },
};
