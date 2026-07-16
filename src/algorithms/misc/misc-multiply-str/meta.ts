// 字符串相乘 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-multiply-str',
  categoryId: 'misc',
  title: { zh: '字符串相乘', en: 'Multiply Strings' },
  summary: {
    zh: '两个用字符串表示的非负整数相乘，结果也是字符串。',
    en: 'Multiply two non-negative integers given as strings, return the product as a string.',
  },
  description: {
    zh: 'LeetCode 43 字符串相乘：模拟竖式乘法，用数组累加部分积。',
    en: 'LeetCode 43 Multiply Strings: simulate long multiplication, accumulating partial products in an array.',
  },
  tags: ['misc', 'string', 'math', 'leetcode'],
  complexity: { time: 'O(m·n)', space: 'O(m+n)' },
};
