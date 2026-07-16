// 递归求数字各位和 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sum-digits',
  categoryId: 'recursion',
  title: { zh: '递归求数字各位和', en: 'Recursive Digit Sum' },
  summary: {
    zh: '取 n mod 10 得末位 + 递归 n/10，直至 n=0。',
    en: 'Take n mod 10 for the last digit plus recursion on n/10, until n = 0.',
  },
  description: {
    zh: '求一个非负整数各位数字之和的经典递归：\n\n- 基例：n == 0 → 0\n- 否则：(n % 10) + sumDigits(floor(n / 10))\n\n每层规模缩小为 1/10，递归深度等于数字位数。也可迭代地写，但递归形态最能体现「分治一个十进制表示」的思路。',
    en: 'Classic recursion for the sum of an integer\'s digits:\n\n- Base: n == 0 → 0\n- Else: (n % 10) + sumDigits(floor(n / 10))\n\nEach level shrinks the input by 10×, depth = number of digits. Iterative versions exist, but the recursive form best shows the "decompose a decimal representation" idea.',
  },
  tags: ['recursion', 'number-theory'],
  complexity: { time: 'O(d)', space: 'O(d)' },
};
