// 阶乘末尾零（数学） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-trailing-zero',
  categoryId: 'misc',
  title: { zh: '阶乘末尾零（数学）', en: 'Trailing Zeroes (Math)' },
  summary: {
    zh: 'n! 末尾 0 数 = ⌊n/5⌋+⌊n/25⌋+...，O(log n)。',
    en: 'Number of trailing zeros in n! = sum ⌊n/5⌋+⌊n/25⌋+..., O(log n).',
  },
  description: {
    zh: 'LeetCode 172 阶乘后的零：不计算 n!，直接统计 5 的因子个数。',
    en: 'LeetCode 172 Factorial Trailing Zeroes: count factors of 5 without computing n!.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
