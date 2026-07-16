// 反复加位数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-add-digits',
  categoryId: 'misc',
  title: { zh: '反复加位数到一位', en: 'Add Digits (Digital Root)' },
  summary: {
    zh: '把一个数的各位反复相加，直到剩下一位（数根），LeetCode 258。',
    en: 'Repeatedly sum the digits of a number until a single digit remains (digital root), LeetCode 258.',
  },
  description: {
    zh: 'LeetCode 258 各位相加（数根 / digital root）：\n\n- 模拟：反复求各位之和直到结果 < 10。\n- 数学公式（O(1)）：\n  - dr(0) = 0\n  - dr(n) = 1 + (n-1) % 9（n > 0）\n- 等价于 n mod 9（0 时特判为 9，除非 n=0）。',
    en: 'LeetCode 258 Add Digits (digital root):\n\n- Simulation: repeatedly sum digits until the result < 10.\n- Closed form (O(1)):\n  - dr(0) = 0\n  - dr(n) = 1 + (n-1) % 9 (n > 0)\n- Equivalently n mod 9 (with 9 instead of 0 for nonzero multiples, except n=0).',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
