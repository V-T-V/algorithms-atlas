// Amicable Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'amicable-number',
  categoryId: 'math',
  title: { zh: '亲和数对', en: 'Amicable Number Pair' },
  summary: {
    zh: '判定亲和数对：(a,b) 满足 σ(a)=σ(b)=a+b。',
    en: 'Test amicable pairs: (a,b) with σ(a)=σ(b)=a+b.',
  },
  description: {
    zh: '亲和数对 (a,b)：a 的真因子和等于 b，b 的真因子和等于 a，且 a≠b。最小一对是 (220, 284)：220 的真因子 1+2+4+5+10+11+20+22+44+55+110=284，284 的真因子 1+2+4+71+142=220。本实现提供单数判定（找其配对）与区间内搜索所有亲和数对。判定 O(√n)。',
    en: 'An amicable pair (a,b): the sum of proper divisors of a equals b and vice versa, with a≠b. Smallest pair is (220, 284). We provide single-number test (find its partner) and a range search for all amicable pairs. Test O(√n).',
  },
  tags: ['math', 'number-theory', 'amicable', 'divisors', 'pair'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
