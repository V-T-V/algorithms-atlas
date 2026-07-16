// 字母大小写全排列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-letter-case-permute',
  categoryId: 'backtracking',
  title: { zh: '字母大小写全排列', en: 'Letter Case Permutation' },
  summary: {
    zh: '回溯生成字符串中每个字母的大小写所有组合。',
    en: 'Backtracking to generate all case combinations of letters in a string.',
  },
  description: {
    zh: '数字保持不变，每个字母可选小写或大写。回溯对每个字母做两种选择。',
    en: 'Digits stay fixed; each letter can be lower or upper case. Backtracking makes two choices per letter.',
  },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(2^n·n)', space: 'O(n)' },
};
