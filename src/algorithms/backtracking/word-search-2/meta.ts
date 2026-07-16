// 单词搜索 II（Word Search II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'word-search-2',
  categoryId: 'backtracking',
  title: { zh: '单词搜索 II', en: 'Word Search II' },
  summary: {
    zh: '在字符网格上找出词典中所有出现的单词（Trie + 回溯）。',
    en: 'Find all dictionary words present in a character grid (Trie + backtracking).',
  },
  description: {
    zh: '给定一个 m×n 字符网格和一个词典，找出所有在网格中出现的单词。单词由相邻单元格（上下左右）的字母连接构成，同一单元格不能重复使用。\n\n关键优化：把所有单词建成一棵前缀树（Trie），从每个单元格出发做回溯 DFS，沿 Trie 节点同步下降。一旦当前路径不是任何单词前缀就立即剪枝；命中单词节点就记录。这样一次 DFS 同时匹配多个共享前缀的单词，远快于对每个单词单独搜索。',
    en: 'Given an m×n character grid and a dictionary, find all words that appear in the grid. A word is formed by chaining letters of adjacent cells (4-directional), and each cell may be used at most once per word.\n\nKey optimization: insert all words into a Trie, then from each cell run backtracking DFS that descends the Trie in lockstep. Prune as soon as the current path is no prefix of any word; record when a word node is hit. This matches many shared-prefix words in a single DFS, far faster than searching each word independently.',
  },
  tags: ['backtracking', 'trie', 'dfs', 'pruning'],
  complexity: { time: 'O(m·n·4^L)', space: 'O(L·W)' },
  references: [{ label: 'LeetCode 212', url: 'https://leetcode.com/problems/word-search-ii/' }],
  defaultInput: {
    board: [
      ['o', 'a', 'a', 'n'],
      ['e', 't', 'a', 'e'],
      ['i', 'h', 'k', 'r'],
      ['i', 'f', 'l', 'v'],
    ],
    words: ['oath', 'pea', 'eat', 'rain'],
  },
};
