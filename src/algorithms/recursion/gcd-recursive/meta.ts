// 递归欧几里得 GCD · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gcd-recursive',
  categoryId: 'recursion',
  title: { zh: '递归欧几里得 GCD', en: 'Recursive Euclidean GCD' },
  summary: {
    zh: 'gcd(a,b) = gcd(b, a mod b)，直至 b=0，递归天然。',
    en: 'gcd(a,b) = gcd(b, a mod b) until b = 0; recursion falls out naturally.',
  },
  description: {
    zh: '欧几里得算法求最大公约数：每一步把 (a, b) 归约成 (b, a mod b)，因为 gcd(a,b) = gcd(b, a mod b)；当 b == 0 时 a 即为 gcd。这是递归的教科书例子——状态每步严格减小，必然终止。\n\n递归深度 O(log min(a,b))。',
    en: 'Euclidean algorithm for the greatest common divisor: each step reduces (a, b) to (b, a mod b), since gcd(a,b) = gcd(b, a mod b); when b == 0, a is the gcd. A textbook recursion — state strictly decreases each step, so it always terminates.\n\nRecursion depth O(log min(a,b)).',
  },
  tags: ['recursion', 'number-theory'],
  complexity: { time: 'O(log min(a,b))', space: 'O(log min(a,b))' },
};
