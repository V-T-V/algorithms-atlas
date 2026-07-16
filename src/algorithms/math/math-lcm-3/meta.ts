import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-lcm-3',
  categoryId: 'math',
  title: { zh: '多元素 LCM', en: 'LCM of Multiple Numbers' },
  summary: {
    zh: '用 gcd 滚动求多个数的最小公倍数。',
    en: 'Roll LCM across a list using gcd-based identity.',
  },
  description: {
    zh: 'lcm(a,b)=a/gcd(a,b)*b。对列表反复 lcm(accum, x)。',
    en: 'lcm(a,b)=a/gcd(a,b)*b. Fold over the list with this binary LCM.',
  },
  tags: ['math', 'lcm'],
  complexity: { time: 'O(n log m)', space: 'O(1)' },
};
