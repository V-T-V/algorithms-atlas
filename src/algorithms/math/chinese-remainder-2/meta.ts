// 中国剩余定理扩展版（非互素模数）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chinese-remainder-2',
  categoryId: 'math',
  title: { zh: '中国剩余定理扩展版（非互素模数）', en: 'CRT Extension (Non-coprime Moduli)' },
  summary: {
    zh: '逐步合并同余方程，支持模数不互素的情况，无解时报告。',
    en: 'Incrementally merge congruences even when moduli are not coprime; reports infeasibility.',
  },
  description: {
    zh: '经典 CRT 要求模数两两互素。扩展版逐步合并两个同余式 x ≡ r1 (mod m1) 与 x ≡ r2 (mod m2)：用扩展欧几里得求 g = gcd(m1, m2)，若 (r2 - r1) 不能被 g 整除则无解；否则合并为 x ≡ r (mod lcm(m1, m2))。重复 n-1 次得到全局解。全程用 BigInt 保证大数精确。',
    en: 'Classic CRT requires pairwise coprime moduli. The extended version merges two congruences x ≡ r1 (mod m1), x ≡ r2 (mod m2) at a time: compute g = gcd(m1, m2) via extended Euclid; if (r2 - r1) is not divisible by g there is no solution; otherwise merge into x ≡ r (mod lcm(m1, m2)). Repeat n-1 times. Uses BigInt throughout for exactness.',
  },
  tags: ['math', 'number-theory', 'crt', 'modular'],
  complexity: { time: 'O(n log M)', space: 'O(1)' },
};
