// 整数拆分 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-integer-break',
  categoryId: 'misc',
  title: { zh: '整数拆分', en: 'Integer Break' },
  summary: {
    zh: '把 n 拆成至少两个正整数之和使其乘积最大，贪心拆 3（LeetCode 343）。',
    en: 'Split n into at least two positive integers maximizing the product; greedily use 3s (LeetCode 343).',
  },
  description: {
    zh: 'LeetCode 343 整数拆分：\n\n- 把 n 拆成 k>=2 个正整数之和，使乘积最大。\n- 数学最优：尽可能多拆 3（3 比 2 更优，4 以上应继续拆）。\n- 余数：n%3==0 全 3；==1 把一个 3+1 换成 2+2；==2 保留一个 2。\n- 特例 n=2,3 返回 n-1。',
    en: 'LeetCode 343 Integer Break:\n\n- Split n into k>=2 positive integers maximizing the product.\n- Optimal: use as many 3s as possible (3 beats 2; anything >= 4 should be split further).\n- Remainder: n%3==0 all 3s; ==1 trade a 3+1 for 2+2; ==2 keep a 2.\n- Edge n=2,3 returns n-1.',
  },
  tags: ['misc', 'math', 'greedy', 'leetcode'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
