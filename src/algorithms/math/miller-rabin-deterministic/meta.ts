// 确定性 Miller-Rabin · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'miller-rabin-deterministic',
  categoryId: 'math',
  title: { zh: '确定性 Miller-Rabin', en: 'Deterministic Miller-Rabin' },
  summary: {
    zh: '用固定Witness集合对 64 位以内整数做确定性素性判定。',
    en: 'Deterministic primality test for integers up to 2^64 using a fixed witness set.',
  },
  description: {
    zh: 'Miller-Rabin 是概率性素性测试，但对 32 位整数使用 witnesses {2,7,61}、对 64 位使用 {2,3,5,7,11,13,17,19,23,29,31,37} 即可做到确定性判定（无伪素数）。将 n-1 分解为 d·2^r，对每个 witness a 检验：a^d ≡ 1 (mod n) 或存在 0≤i<r 使 a^(d·2^i) ≡ -1 (mod n)。任一 witness 不满足则 n 为合数。BigInt 模幂实现。',
    en: 'Miller-Rabin is a probabilistic primality test, but using witnesses {2,7,61} for 32-bit and {2,3,5,7,11,13,17,19,23,29,31,37} for 64-bit makes it deterministic (no pseudoprimes). Factor n-1 = d·2^r, then for each witness a check: a^d ≡ 1 (mod n) or a^(d·2^i) ≡ -1 (mod n) for some 0≤i<r. If any witness fails, n is composite. BigInt modular exponentiation used.',
  },
  tags: ['math', 'number-theory', 'primality', 'deterministic'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
