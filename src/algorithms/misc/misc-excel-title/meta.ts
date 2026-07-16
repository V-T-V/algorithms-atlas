// Excel 列号转换 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-excel-title',
  categoryId: 'misc',
  title: { zh: 'Excel 列号转换', en: 'Excel Sheet Column' },
  summary: {
    zh: '数字 ↔ Excel 列标题互转（1↔A, 28↔AB），LeetCode 168/171。',
    en: 'Convert between numbers and Excel column titles (1↔A, 28↔AB), LeetCode 168/171.',
  },
  description: {
    zh: 'LeetCode 168/171 Excel 列号转换：\n\n- 数字 → 标题（168）：本质是 26 进制，但无 0 位（A=1..Z=26），每次用 (n-1)%26 取字母、n=(n-1)/26 推进。\n- 标题 → 数字（171）：从左到右 result = result*26 + (字符序号+1)。',
    en: 'LeetCode 168/171 Excel Column:\n\n- Number → title (168): base-26 with no zero digit (A=1..Z=26); use (n-1)%26 for the letter and n=(n-1)/26 to advance.\n- Title → number (171): left to right, result = result*26 + (letterIndex+1).',
  },
  tags: ['misc', 'math', 'base-conversion', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
