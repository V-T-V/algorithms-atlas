// 最长单词（DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-longest-word-dfs',
  categoryId: 'recursion',
  title: { zh: '字典中最长单词（DFS/Trie）', en: 'Longest Word in Dictionary (DFS/Trie)' },
  summary: {
    zh: 'Trie + DFS：每次只能加一个字母地构造单词，找可由单词字典逐步构建的最长单词。',
    en: 'Trie + DFS: build words by adding one letter at a time; find the longest word that can be constructed step-by-step from the dictionary.',
  },
  description: {
    zh: '给定字符串列表 words，找出 words 中最长的单词 w，满足 w 的每个前缀（w[0..i]）都在 words 中。若多个等长取字典序最小。解法：把所有单词插入 Trie，标记单词结尾；从根 DFS，只在「当前路径是完整单词」时才继续深入，记录遇到的最长（且字典序最小）单词。',
    en: 'Given a list of words, find the longest word w in words such that every prefix w[0..i] is also in words. Break ties by smallest lexicographic order. Solution: insert all words into a Trie marking word-ends; DFS from the root, only descending into children whose path forms a complete word, tracking the longest (and lexicographically smallest) word found.',
  },
  tags: ['recursion', 'trie', 'dfs', 'string', 'prefix'],
  complexity: { time: 'O(Σ|w|)', space: 'O(Σ|w|)' },
};
