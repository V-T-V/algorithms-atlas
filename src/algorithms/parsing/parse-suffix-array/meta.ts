import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-suffix-array',
  categoryId: 'parsing',
  title: { zh: '后缀数组', en: 'Suffix Array' },
  summary: {
    zh: '对字符串所有后缀排序得到索引数组，是字符串处理基础结构。',
    en: 'Sort all suffixes to get an index array; foundational for string algorithms.',
  },
  description: {
    zh: '生成 0..n-1 的下标数组，按 s[i..] 升序排列。',
    en: 'Index array 0..n-1 sorted lexicographically by s[i..].',
  },
  tags: ['parsing', 'suffix-array', 'string'],
  complexity: { time: 'O(n^2 log n)', space: 'O(n)' },
};
