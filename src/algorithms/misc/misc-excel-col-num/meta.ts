// Excel 表列号 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-excel-col-num',
  categoryId: 'misc',
  title: { zh: 'Excel 表列号', en: 'Excel Sheet Column Number' },
  summary: {
    zh: '把 Excel 列名转为列号（A→1, AB→28）。',
    en: 'Convert an Excel column title to its number (A→1, AB→28).',
  },
  description: {
    zh: 'LeetCode 171 Excel 表列序号：把 A-Z 二十六进制字符串转为 1-based 数字。',
    en: 'LeetCode 171 Excel Sheet Column Number: convert a base-26 A-Z string to its 1-based number.',
  },
  tags: ['misc', 'math', 'string', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
