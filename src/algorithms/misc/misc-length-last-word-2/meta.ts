// 最后一个单词长度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-length-last-word-2',
  categoryId: 'misc',
  title: { zh: '最后一个单词长度', en: 'Length of Last Word' },
  summary: {
    zh: '从后向前跳过空格，找最后一个单词的长度。',
    en: 'Skip trailing spaces from the end, then count the last word length.',
  },
  description: {
    zh: 'LeetCode 58 最后一个单词的长度：句子由空格分隔单词，返回最后一个单词长度。',
    en: 'LeetCode 58 Length of Last Word: a sentence split by spaces; return the last word length.',
  },
  tags: ['misc', 'string', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
