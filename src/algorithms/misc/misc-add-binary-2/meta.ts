// 二进制求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-add-binary-2',
  categoryId: 'misc',
  title: { zh: '二进制求和', en: 'Add Binary' },
  summary: {
    zh: '两个二进制字符串相加，返回和的二进制字符串。',
    en: 'Add two binary strings and return the sum as a binary string.',
  },
  description: {
    zh: 'LeetCode 67 二进制求和：从最低位逐位相加，处理进位。',
    en: 'LeetCode 67 Add Binary: add digit by digit from the LSB, handling carries.',
  },
  tags: ['misc', 'string', 'math', 'leetcode'],
  complexity: { time: 'O(max(m,n))', space: 'O(max(m,n))' },
};
