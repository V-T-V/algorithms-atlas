// 完全幂判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-perfect-power',
  categoryId: 'misc',
  title: { zh: '完全幂判定', en: 'Perfect Power Detection' },
  summary: {
    zh: '判定 n 是否能写成 a^b（a>=1, b>=2）并给出 (a,b)。',
    en: 'Determine whether n can be written as a^b (a>=1, b>=2) and return (a,b).',
  },
  description: {
    zh: '完全幂（perfect power）：若存在整数 a>=1, b>=2 使 n = a^b，则 n 是完全幂。\n\n- 对每个可能的指数 b（从 log2 n 递减到 2），用二分查找底数 a。\n- 找到整数 a 使 a^b = n 即返回。\n- 复杂度 O(log^2 n)。',
    en: 'A perfect power: n = a^b for integers a>=1, b>=2.\n\n- For each candidate exponent b (from log2 n down to 2), binary-search the base a.\n- Return on finding an integer a with a^b = n.\n- Complexity O(log^2 n).',
  },
  tags: ['misc', 'number-theory', 'math'],
  complexity: { time: 'O(log^2 n)', space: 'O(1)' },
};
