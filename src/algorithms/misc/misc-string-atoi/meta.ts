// 字符串转换整数 (atoi) · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-string-atoi',
  categoryId: 'misc',
  title: { zh: '字符串转换整数 (atoi)', en: 'String to Integer (atoi)' },
  summary: {
    zh: '按规则把字符串转为 32 位有符号整数：跳过空格、读符号、读数字、截断到范围。',
    en: 'Convert a string to a 32-bit signed int per rules: skip spaces, read sign, read digits, clamp to range.',
  },
  description: {
    zh: 'LeetCode 8 字符串转换整数 (atoi)：跳过前导空格，可选符号，连续数字部分解析为整数，超出 [−2^31, 2^31−1] 时截断。',
    en: 'LeetCode 8 String to Integer (atoi): skip leading spaces, optional sign, then consecutive digits; clamp to [−2^31, 2^31−1].',
  },
  tags: ['misc', 'string', 'math', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
