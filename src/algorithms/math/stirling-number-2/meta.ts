// 第二类 Stirling 数（显式公式版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stirling-number-2',
  categoryId: 'math',
  title: {
    zh: '第二类 Stirling 数（显式公式）',
    en: 'Stirling Number Second Kind (Explicit Formula)',
  },
  summary: {
    zh: '用容斥显式公式 S(n,k)=(1/k!)Σ(-1)^j C(k,j)(k-j)^n 计算。',
    en: 'Compute S(n,k) via the inclusion-exclusion formula (1/k!)Σ(-1)^j C(k,j)(k-j)^n.',
  },
  description: {
    zh: '第二类 Stirling 数 S(n,k) 把 n 个不同元素划分为 k 个非空集合的方案数。除经典递推 S(n,k)=k·S(n-1,k)+S(n-1,k-1) 外，还有容斥显式公式：S(n,k) = (1/k!) Σ_{j=0}^{k} (−1)^j · C(k,j) · (k−j)^n。本实现用该公式对单点 (n,k) 直接求值，时间 O(k log n)，适合 n 很大但 k 较小的场景。BigInt 精确。',
    en: 'The Stirling number of the second kind S(n,k) counts partitions of n distinct elements into k nonempty sets. Besides the classic recurrence, the inclusion-exclusion formula gives S(n,k) = (1/k!) Σ_{j=0}^{k} (−1)^j · C(k,j) · (k−j)^n. This implementation evaluates a single (n,k) directly in O(k log n), suited to large n with small k. Exact BigInt.',
  },
  tags: ['math', 'combinatorics', 'stirling', 'inclusion-exclusion'],
  complexity: { time: 'O(k log n)', space: 'O(1)' },
};
