// 外观数列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-count-and-say',
  categoryId: 'misc',
  title: { zh: '外观数列', en: 'Count and Say' },
  summary: {
    zh: '逐项描述前一项数字：n=1→"1"，n=2→"11"，n=3→"21"，n=4→"1211"。',
    en: 'Describe the previous term: n=1→"1", n=2→"11", n=3→"21", n=4→"1211".',
  },
  description: {
    zh: 'LeetCode 38 外观数列：从 "1" 开始，每项是把前一项「读出来」（连续相同数字用 个数+数字 表示）。',
    en: 'LeetCode 38 Count and Say: starting from "1", each term reads out the previous (count + digit for each run).',
  },
  tags: ['misc', 'string', 'leetcode'],
  complexity: { time: 'O(L·n)', space: 'O(L)' },
};
