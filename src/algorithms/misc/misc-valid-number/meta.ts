// 有效数字 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-valid-number',
  categoryId: 'misc',
  title: { zh: '有效数字', en: 'Valid Number' },
  summary: {
    zh: '用有限状态机判定字符串是否是合法十进制数（含指数、小数、符号）。',
    en: 'Use a finite-state machine to check if a string is a valid decimal number (with exponent, fraction, sign).',
  },
  description: {
    zh: 'LeetCode 65 有效数字：判定字符串能否解析为数值（含 ±、小数点、e/E、前后空格）。',
    en: 'LeetCode 65 Valid Number: determine whether a string can be parsed as a number (signs, decimal, exponent, surrounding spaces).',
  },
  tags: ['misc', 'string', 'fsm', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
