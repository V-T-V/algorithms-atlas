// 大数组合数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ncr-large',
  categoryId: 'math',
  title: { zh: '大数组合数（精确 BigInt）', en: 'Large Combination (Exact BigInt)' },
  summary: {
    zh: '用素因子分解 + 约分精确计算任意大 C(n,r)，结果为 BigInt。',
    en: 'Compute exact C(n,r) for arbitrary large n via prime-factorization cancellation, returning BigInt.',
  },
  description: {
    zh: '当 C(n,r) 超过 JS 安全整数范围时，用素因子分解法精确计算：(1) 对分子 n!/(r!(n-r)!) 中每个素因子 p，统计其在结果中的幂次 e = Σ⌊n/p^k⌋ − ⌊r/p^k⌋ − ⌊(n−r)/p^k⌋（Legendre 公式）；(2) 用快速幂累乘 p^e。完全避免大整数除法，时间约 O(n log n)（受限于素因子枚举），结果精确为 BigInt。',
    en: 'When C(n,r) exceeds the JS safe-integer range, use prime factorization to compute exactly: (1) for each prime p in the numerator n!/(r!(n-r)!), tally its exponent e = Σ⌊n/p^k⌋ − ⌊r/p^k⌋ − ⌊(n−r)/p^k⌋ (Legendre formula); (2) multiply p^e via fast exponentiation. Avoids big-integer division entirely; ~O(n log n) (bounded by prime enumeration); result is an exact BigInt.',
  },
  tags: ['math', 'combinatorics', 'big-integer', 'binomial-coefficient'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
