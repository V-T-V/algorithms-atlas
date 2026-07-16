// 最大唯一拆分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-max-unique-substrings',
  categoryId: 'backtracking',
  title: { zh: '最大唯一拆分', en: 'Max Unique Substrings Split' },
  summary: {
    zh: '把字符串拆成尽量多的互不相同的子串。',
    en: 'Split string into max number of distinct substrings.',
  },
  description: {
    zh: '回溯切分，集合去重。',
    en: 'Backtrack with a set of used substrings. O(2^n).',
  },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
