// 超级幂 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-super-pow',
  categoryId: 'misc',
  title: { zh: '超级幂', en: 'Super Pow' },
  summary: {
    zh: '计算 a^b mod 1337，其中 b 是大整数数组（LeetCode 372）。',
    en: 'Compute a^b mod 1337 where b is a large integer array (LeetCode 372).',
  },
  description: {
    zh: 'LeetCode 372 超级幂：\n\n- 给定底数 a 和用数组表示的大指数 b = [b0,b1,...,bk]。\n- 求 a^b mod 1337。\n\n利用恒等式：\n- a^(10x+y) = (a^x)^10 · a^y。\n- 从高位到低位逐位累积，每步做模运算防止溢出。',
    en: 'LeetCode 372 Super Pow:\n\n- Given base a and exponent b as a digit array [b0,b1,...,bk].\n- Compute a^b mod 1337.\n\nIdentity used:\n- a^(10x+y) = (a^x)^10 · a^y.\n- Accumulate from the most significant digit, reducing mod at each step to avoid overflow.',
  },
  tags: ['misc', 'math', 'modular', 'leetcode'],
  complexity: { time: 'O(k · log m)', space: 'O(1)' },
};
