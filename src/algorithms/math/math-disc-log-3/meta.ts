import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-disc-log-3',
  categoryId: 'math',
  title: { zh: '离散对数（小步大步）', en: 'Discrete Logarithm (Baby-Step Giant-Step)' },
  summary: {
    zh: 'BSGS 求 a^x ≡ b (mod m) 的最小非负整数解，需 gcd(a,m)=1。',
    en: 'BSGS finds the smallest non-negative x with a^x ≡ b (mod m); requires gcd(a,m)=1.',
  },
  description: {
    zh: '令 n=⌈√m⌉。先算小步 a^j mod m（j=0..n-1）存哈希；再大步 b·a^(-in) mod m 查哈希，命中则 x=in+j。',
    en: 'Set n=⌈√m⌉. Precompute baby steps a^j mod m (j=0..n-1); for each giant step i, compute b·a^(-in) and look it up.',
  },
  tags: ['math', 'discrete-log', 'bsgs'],
  complexity: { time: 'O(√m)', space: 'O(√m)' },
};
