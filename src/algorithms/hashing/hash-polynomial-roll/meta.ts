// 多项式滚动哈希（Polynomial Rolling Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-polynomial-roll',
  categoryId: 'hashing',
  title: { zh: '多项式滚动哈希', en: 'Polynomial Rolling Hash' },
  summary: {
    zh: '把字符串视作多项式系数，模大素数求值，支持双模防碰撞。',
    en: 'Treat string as polynomial coefficients evaluated mod a large prime; pair mods to avoid collisions.',
  },
  description: {
    zh: '多项式哈希：H(s)=Σ s[i]*a^(n-1-i) mod p。双模 (p1,p2) 几乎无碰撞，用于字符串比较。',
    en: 'Polynomial hash: H(s)=Σ s[i]*a^(n-1-i) mod p. Dual mod (p1,p2) near-collision-free for string compare.',
  },
  tags: ['hashing', 'rolling-hash', 'polynomial'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
