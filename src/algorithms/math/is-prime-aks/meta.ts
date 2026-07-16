import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'is-prime-aks',
  categoryId: 'math',
  title: { zh: 'AKS 素性测试', en: 'AKS Primality Test' },
  summary: {
    zh: '确定性多项式时间素性测试，检查 (x-1)^n ≡ x^n-1 (mod n)。',
    en: 'Deterministic polynomial-time primality via (x-1)^n ≡ x^n-1 (mod n).',
  },
  description: {
    zh: 'AKS（Agrawal-Kayal-Saxena, 2002）是首个被证明在多项式时间内确定性判定素性的算法，理论意义重大。其核心基于：n 为素数当且仅当多项式同余 (x-1)^n ≡ (x^n - 1) (mod n) 成立，等价于二项式系数 C(n,k)（0<k<n）均被 n 整除。本实现给出基于该判据的直接验证版本（用 BigInt 精确计算组合数），适合教学与小到中等规模 n；严格 AKS 还包含找合适的 r、检查阶等步骤以达到最优复杂度。与 Miller-Rabin（概率）相比 AKS 确定但更慢。',
    en: 'AKS (Agrawal-Kayal-Saxena, 2002) is the first proven deterministic polynomial-time primality test, of major theoretical importance. Its core: n is prime iff (x-1)^n ≡ (x^n - 1) (mod n), equivalent to all binomial coefficients C(n,k) (0<k<n) being divisible by n. This implementation provides a direct verification of that criterion (exact BigInteger coefficients) suitable for teaching and small-to-medium n; full AKS adds steps (finding r, order checks) for optimal complexity. Compared with Miller-Rabin (probabilistic), AKS is deterministic but slower.',
  },
  tags: ['math', 'number-theory', 'prime', 'aks', 'deterministic', 'polynomial'],
  complexity: { time: 'O(log^6 n)', space: 'O(log n)' },
};
