// 最大数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-largest-number',
  categoryId: 'misc',
  title: { zh: '最大数', en: 'Largest Number' },
  summary: {
    zh: '把一组非负整数拼成最大的数，自定义比较器排序（LeetCode 179）。',
    en: 'Concatenate non-negative integers into the largest possible number via a custom comparator (LeetCode 179).',
  },
  description: {
    zh: 'LeetCode 179 最大数：\n\n- 给定一组非负整数，把它们排列拼接成最大的字符串。\n- 关键：自定义比较 a vs b 比较 ab 与 ba 字符串字典序（降序）。\n- 全 0 时返回 "0" 而非 "000..."。',
    en: 'LeetCode 179 Largest Number:\n\n- Given non-negative integers, arrange and concatenate them into the largest string.\n- Key: custom comparator comparing ab vs ba lexicographically (descending).\n- Return "0" (not "000...") when all inputs are zero.',
  },
  tags: ['misc', 'sorting', 'comparator', 'leetcode'],
  complexity: { time: 'O(n log n · L)', space: 'O(n·L)' },
};
