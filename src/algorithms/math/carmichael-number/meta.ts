// Carmichael Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'carmichael-number',
  categoryId: 'math',
  title: { zh: 'Carmichael 数判定', en: 'Carmichael Number' },
  summary: {
    zh: '判定合数 n 是否为 Carmichael 数（费马伪素数）。',
    en: 'Test whether a composite n is a Carmichael number (Fermat pseudoprime).',
  },
  description: {
    zh: 'Carmichael 数是满足「对所有与 n 互质的 b，b^(n-1) ≡ 1 (mod n)」的合数 n，即费马素性检验的绝对伪素数。Korselt 判据：n 是 Carmichael 数 iff n 无平方因子且对 n 的任意素因子 p 都有 (p-1) | (n-1)。最小的 Carmichael 数是 561 = 3·11·17。本实现先做素性检测（必须为合数），再用 Korselt 判据验证。时间约 O(√n)。',
    en: 'A Carmichael number is a composite n such that b^(n-1) ≡ 1 (mod n) for every b coprime to n (an absolute Fermat pseudoprime). Korselt criterion: n is Carmichael iff n is square-free and (p-1) divides (n-1) for every prime p | n. Smallest is 561 = 3·11·17. We first check compositeness then apply Korselt. Time ~O(√n).',
  },
  tags: ['math', 'number-theory', 'carmichael', 'pseudoprime', 'fermat'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
