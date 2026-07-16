// 简化路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-simplify-path',
  categoryId: 'misc',
  title: { zh: '简化路径', en: 'Simplify Path' },
  summary: {
    zh: '把 Unix 风格的绝对路径简化为规范形式（处理 . .. //）。',
    en: 'Simplify a Unix-style absolute path to canonical form (handles . .. //).',
  },
  description: {
    zh: 'LeetCode 71 简化路径：把含 ".", "..", "//" 的绝对路径化为最简规范路径。',
    en: 'LeetCode 71 Simplify Path: reduce an absolute path containing ".", "..", "//" to its canonical form.',
  },
  tags: ['misc', 'string', 'stack', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
