// 交换指定两位 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'swap-bits',
  categoryId: 'bitwise',
  title: { zh: '交换指定两位', en: 'Swap Two Bits' },
  summary: {
    zh: '无分支交换整数第 i、j 位。',
    en: 'Branchlessly swap bit i and bit j of an integer.',
  },
  description: {
    zh: '交换整数 x 的第 i 位与第 j 位（0-based，从低位数）：先取出两位 bi、bj，若不同则把 (1<<i)|(1<<j) 异或到 x 上即可翻转两者。常用写法 x ^= ((bi ^ bj) << i) | ((bi ^ bj) << j)，或更简洁：若 ((x>>i) ^ (x>>j)) & 1 为 1，则 x ^= (1<<i)|(1<<j)。全程无分支。',
    en: 'Swap bit i and bit j (0-based, LSB) of integer x: extract bi and bj; if they differ, XOR x with (1<<i)|(1<<j) to flip both. A common form is x ^= ((bi ^ bj) << i) | ((bi ^ bj) << j), or more compactly: if ((x>>i) ^ (x>>j)) & 1 is 1, then x ^= (1<<i)|(1<<j). Entirely branchless.',
  },
  tags: ['bitwise', 'swap', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
