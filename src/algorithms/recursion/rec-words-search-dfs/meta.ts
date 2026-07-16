// 单词搜索（DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-words-search-dfs',
  categoryId: 'recursion',
  title: { zh: '单词搜索（DFS 回溯）', en: 'Word Search (DFS Backtracking)' },
  summary: {
    zh: '在字符网格中 DFS 回溯搜索单词：四向扩展，已用格子临时标记防重。',
    en: 'Search for a word in a character grid via DFS backtracking: expand in 4 directions, marking used cells to avoid reuse.',
  },
  description: {
    zh: '给定 m×n 字符网格 board 和单词 word，判断 word 是否存在于网格中。单词由相邻格子（水平/垂直）的字符依次组成，同一格不能重复使用。DFS 回溯：从每个与 word[0] 匹配的格子出发，递归匹配后续字符，进入下一格前把当前格临时标记（如置为 #），返回后恢复。本实现返回是否存在及匹配路径。',
    en: 'Given an m x n character grid board and a word, determine whether the word exists in the grid. The word is formed by characters of adjacent cells (horizontal/vertical); each cell is used at most once. DFS backtracking: start from each cell matching word[0], recurse to match subsequent characters, marking the current cell temporarily (e.g. as #) before descending and restoring it afterwards. This implementation returns whether it exists and the matched path.',
  },
  tags: ['recursion', 'dfs', 'backtracking', 'grid', 'string'],
  complexity: { time: 'O(m·n·4^L)', space: 'O(L)' },
};
