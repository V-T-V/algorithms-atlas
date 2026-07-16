// 斐波那契（黄金比公式）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-golden',
  categoryId: 'math',
  title: { zh: '斐波那契（黄金比公式）', en: 'Fibonacci (Golden Ratio Formula)' },
  summary: {
    zh: '用 Binet 公式 F(n)=(φ^n−ψ^n)/√5 精确求 F(n)。',
    en: 'Compute F(n) exactly via Binet formula F(n)=(φ^n−ψ^n)/√5.',
  },
  description: {
    zh: 'Binet 公式给出斐波那契数的闭式：F(n) = (φ^n − ψ^n)/√5，其中 φ=(1+√5)/2（黄金比），ψ=(1−√5)/2。由于 ψ^n→0，F(n) ≈ round(φ^n/√5)。本实现用整数环 Z[√5]=(a+b√5) 上的快速幂精确计算（避免浮点误差），返回 BigInt。',
    en: 'Binet formula gives the closed form F(n) = (φ^n − ψ^n)/√5, with φ=(1+√5)/2 (golden ratio) and ψ=(1−√5)/2. Since ψ^n→0, F(n) ≈ round(φ^n/√5). This implementation uses fast exponentiation in the integer ring Z[√5]=(a+b√5) to compute exactly without floating-point error, returning BigInt.',
  },
  tags: ['math', 'sequence', 'fibonacci', 'golden-ratio', 'binet'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
