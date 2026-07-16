// Excel 表列名 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-excel-col-title-2',
  categoryId: 'misc',
  title: { zh: 'Excel 表列名', en: 'Excel Sheet Column Title' },
  summary: {
    zh: '把列号转为 Excel 表列名（1→A, 28→AB）。',
    en: 'Convert a column number to Excel title (1→A, 28→AB).',
  },
  description: {
    zh: 'LeetCode 168 Excel 表列名称：把 1-based 数字转为 A-Z 二十六进制字符串。',
    en: 'LeetCode 168 Excel Sheet Column Title: convert a 1-based number to a base-26 string over A-Z.',
  },
  tags: ['misc', 'math', 'string', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
