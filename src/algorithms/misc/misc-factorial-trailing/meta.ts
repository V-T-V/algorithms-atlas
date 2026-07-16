// 阶乘尾零 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-factorial-trailing',
  categoryId: 'misc',
  title: { zh: '阶乘尾零', en: 'Factorial Trailing Zeros' },
  summary: {
    zh: '求 n! 末尾有多少个零，统计因子 5 的个数（LeetCode 172）。',
    en: 'Count trailing zeros of n! by counting factors of 5 (LeetCode 172).',
  },
  description: {
    zh: 'LeetCode 172 阶乘尾零：\n\n- n! 末尾的 0 来自因子 10 = 2×5。\n- 因子 2 远多于 5，所以尾零数 = 5 的因子总数。\n- 递推：count = n/5 + n/25 + n/125 + ... 直到分母超过 n。',
    en: 'LeetCode 172 Factorial Trailing Zeros:\n\n- Trailing zeros in n! come from factors 10 = 2×5.\n- Factors of 2 are far more than 5, so count = total factors of 5.\n- Recurrence: count = n/5 + n/25 + n/125 + ... until the denominator exceeds n.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
